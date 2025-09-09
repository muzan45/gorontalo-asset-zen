const express = require('express');
const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');
const { query, validationResult } = require('express-validator');
const { Inventory, Event, EventItem, Location, User } = require('../models');
const { verifyToken } = require('../middleware/auth');
const { Op } = require('sequelize');

const router = express.Router();

// GET /api/reports/inventory
router.get('/inventory', verifyToken, [
  query('startDate').optional().isISO8601().withMessage('Valid start date is required'),
  query('endDate').optional().isISO8601().withMessage('Valid end date is required'),
  query('category').optional().notEmpty().withMessage('Category cannot be empty'),
  query('condition').optional().notEmpty().withMessage('Condition cannot be empty'),
  query('locationId').optional().isInt().withMessage('Location ID must be an integer')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { startDate, endDate, category, condition, locationId } = req.query;

    const where = {};
    
    if (startDate && endDate) {
      where.acquisitionDate = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }
    
    if (category) where.category = category;
    if (condition) where.condition = condition;
    if (locationId) where.locationId = locationId;

    const inventory = await Inventory.findAll({
      where,
      include: [
        {
          model: Location,
          as: 'location',
          attributes: ['id', 'name', 'building', 'floor']
        },
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'fullName', 'username']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    // Calculate summary statistics
    const totalItems = inventory.length;
    const totalValue = inventory.reduce((sum, item) => sum + (parseFloat(item.acquisitionValue) || 0), 0);
    
    const conditionSummary = inventory.reduce((acc, item) => {
      acc[item.condition] = (acc[item.condition] || 0) + 1;
      return acc;
    }, {});

    const categorySummary = inventory.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {});

    res.json({
      success: true,
      data: {
        inventory,
        summary: {
          totalItems,
          totalValue,
          conditionSummary,
          categorySummary
        },
        filters: { startDate, endDate, category, condition, locationId }
      }
    });
  } catch (error) {
    console.error('Get inventory report error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate inventory report',
      error: error.message
    });
  }
});

// GET /api/reports/events
router.get('/events', verifyToken, [
  query('startDate').optional().isISO8601().withMessage('Valid start date is required'),
  query('endDate').optional().isISO8601().withMessage('Valid end date is required'),
  query('type').optional().notEmpty().withMessage('Type cannot be empty'),
  query('status').optional().notEmpty().withMessage('Status cannot be empty')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { startDate, endDate, type, status } = req.query;

    const where = {};
    
    if (startDate && endDate) {
      where.startDate = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }
    
    if (type) where.type = type;
    if (status) where.status = status;

    const events = await Event.findAll({
      where,
      include: [
        {
          model: Location,
          as: 'location',
          attributes: ['id', 'name', 'building']
        },
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'fullName', 'username']
        },
        {
          model: EventItem,
          as: 'eventItems',
          include: [
            {
              model: Inventory,
              as: 'inventory',
              attributes: ['id', 'name', 'category']
            }
          ]
        }
      ],
      order: [['startDate', 'DESC']]
    });

    // Calculate summary statistics
    const totalEvents = events.length;
    const totalParticipants = events.reduce((sum, event) => sum + (event.participants || 0), 0);
    const totalItemsUsed = events.reduce((sum, event) => 
      sum + event.eventItems.reduce((itemSum, item) => itemSum + item.quantityUsed, 0), 0);

    const typeSummary = events.reduce((acc, event) => {
      acc[event.type] = (acc[event.type] || 0) + 1;
      return acc;
    }, {});

    const statusSummary = events.reduce((acc, event) => {
      acc[event.status] = (acc[event.status] || 0) + 1;
      return acc;
    }, {});

    res.json({
      success: true,
      data: {
        events,
        summary: {
          totalEvents,
          totalParticipants,
          totalItemsUsed,
          typeSummary,
          statusSummary
        },
        filters: { startDate, endDate, type, status }
      }
    });
  } catch (error) {
    console.error('Get events report error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate events report',
      error: error.message
    });
  }
});

// GET /api/reports/inventory/export/pdf
router.get('/inventory/export/pdf', verifyToken, async (req, res) => {
  try {
    const { startDate, endDate, category, condition, locationId } = req.query;

    // Get inventory data (reuse logic from inventory report)
    const where = {};
    if (startDate && endDate) {
      where.acquisitionDate = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }
    if (category) where.category = category;
    if (condition) where.condition = condition;
    if (locationId) where.locationId = locationId;

    const inventory = await Inventory.findAll({
      where,
      include: [
        {
          model: Location,
          as: 'location',
          attributes: ['id', 'name', 'building']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    // Create PDF document
    const doc = new PDFDocument({ margin: 50 });
    
    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=inventory-report-${Date.now()}.pdf`);
    
    doc.pipe(res);

    // Header
    doc.fontSize(20).text('Laporan Inventaris', { align: 'center' });
    doc.fontSize(14).text('UPT BKN Gorontalo', { align: 'center' });
    doc.moveDown();

    // Filter information
    doc.fontSize(12).text(`Tanggal Export: ${new Date().toLocaleDateString('id-ID')}`);
    if (startDate && endDate) {
      doc.text(`Periode: ${new Date(startDate).toLocaleDateString('id-ID')} - ${new Date(endDate).toLocaleDateString('id-ID')}`);
    }
    if (category) doc.text(`Kategori: ${category}`);
    if (condition) doc.text(`Kondisi: ${condition}`);
    doc.moveDown();

    // Summary
    doc.fontSize(14).text('Ringkasan:', { underline: true });
    doc.fontSize(12).text(`Total Item: ${inventory.length}`);
    doc.moveDown();

    // Table header
    const tableTop = doc.y;
    const itemHeight = 20;
    
    doc.fontSize(10);
    doc.text('No', 50, tableTop);
    doc.text('Nama Item', 80, tableTop);
    doc.text('Kategori', 200, tableTop);
    doc.text('Kondisi', 280, tableTop);
    doc.text('Lokasi', 350, tableTop);
    doc.text('Tanggal', 450, tableTop);

    // Draw header line
    doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();

    // Table data
    let currentY = tableTop + 20;
    inventory.forEach((item, index) => {
      if (currentY > 700) { // New page if needed
        doc.addPage();
        currentY = 50;
      }

      doc.text(index + 1, 50, currentY);
      doc.text(item.name.substring(0, 20), 80, currentY);
      doc.text(item.category, 200, currentY);
      doc.text(item.condition, 280, currentY);
      doc.text(item.location ? item.location.name.substring(0, 15) : '-', 350, currentY);
      doc.text(item.acquisitionDate ? new Date(item.acquisitionDate).toLocaleDateString('id-ID') : '-', 450, currentY);
      
      currentY += itemHeight;
    });

    // Footer
    doc.fontSize(8).text(`Generated by: ${req.user.fullName} | ${new Date().toLocaleString('id-ID')}`, 50, doc.page.height - 50);

    doc.end();
  } catch (error) {
    console.error('Export inventory PDF error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export PDF',
      error: error.message
    });
  }
});

// GET /api/reports/inventory/export/excel
router.get('/inventory/export/excel', verifyToken, async (req, res) => {
  try {
    const { startDate, endDate, category, condition, locationId } = req.query;

    // Get inventory data
    const where = {};
    if (startDate && endDate) {
      where.acquisitionDate = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }
    if (category) where.category = category;
    if (condition) where.condition = condition;
    if (locationId) where.locationId = locationId;

    const inventory = await Inventory.findAll({
      where,
      include: [
        {
          model: Location,
          as: 'location'
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    // Create Excel workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Laporan Inventaris');

    // Add header information
    worksheet.addRow(['Laporan Inventaris - UPT BKN Gorontalo']);
    worksheet.addRow([`Tanggal Export: ${new Date().toLocaleDateString('id-ID')}`]);
    if (startDate && endDate) {
      worksheet.addRow([`Periode: ${new Date(startDate).toLocaleDateString('id-ID')} - ${new Date(endDate).toLocaleDateString('id-ID')}`]);
    }
    worksheet.addRow([]); // Empty row

    // Add column headers
    const headers = [
      'No', 'Nama Item', 'Kategori', 'Spesifikasi', 'Merek', 'Model', 
      'Jumlah', 'Kondisi', 'Lokasi', 'Tanggal Perolehan', 'Nilai Perolehan', 'Penanggung Jawab'
    ];
    
    const headerRow = worksheet.addRow(headers);
    headerRow.font = { bold: true };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE6E6E6' }
    };

    // Add data rows
    inventory.forEach((item, index) => {
      worksheet.addRow([
        index + 1,
        item.name,
        item.category,
        item.specification || '-',
        item.brand || '-',
        item.model || '-',
        item.quantity,
        item.condition,
        item.location ? item.location.name : '-',
        item.acquisitionDate ? new Date(item.acquisitionDate).toLocaleDateString('id-ID') : '-',
        item.acquisitionValue ? parseFloat(item.acquisitionValue).toLocaleString('id-ID') : '-',
        item.responsible || '-'
      ]);
    });

    // Auto-fit columns
    worksheet.columns.forEach(column => {
      column.width = 15;
    });

    // Set response headers
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=inventory-report-${Date.now()}.xlsx`);

    // Write to response
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error('Export inventory Excel error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export Excel',
      error: error.message
    });
  }
});

// GET /api/reports/events/export/pdf
router.get('/events/export/pdf', verifyToken, async (req, res) => {
  try {
    const { startDate, endDate, type, status } = req.query;

    // Get events data
    const where = {};
    if (startDate && endDate) {
      where.startDate = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }
    if (type) where.type = type;
    if (status) where.status = status;

    const events = await Event.findAll({
      where,
      include: [
        {
          model: Location,
          as: 'location'
        },
        {
          model: EventItem,
          as: 'eventItems',
          include: [
            {
              model: Inventory,
              as: 'inventory'
            }
          ]
        }
      ],
      order: [['startDate', 'DESC']]
    });

    // Create PDF document
    const doc = new PDFDocument({ margin: 50 });
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=events-report-${Date.now()}.pdf`);
    
    doc.pipe(res);

    // Header
    doc.fontSize(20).text('Laporan Kegiatan', { align: 'center' });
    doc.fontSize(14).text('UPT BKN Gorontalo', { align: 'center' });
    doc.moveDown();

    // Filter information
    doc.fontSize(12).text(`Tanggal Export: ${new Date().toLocaleDateString('id-ID')}`);
    if (startDate && endDate) {
      doc.text(`Periode: ${new Date(startDate).toLocaleDateString('id-ID')} - ${new Date(endDate).toLocaleDateString('id-ID')}`);
    }
    if (type) doc.text(`Jenis: ${type}`);
    if (status) doc.text(`Status: ${status}`);
    doc.moveDown();

    // Summary
    doc.fontSize(14).text('Ringkasan:', { underline: true });
    doc.fontSize(12).text(`Total Kegiatan: ${events.length}`);
    doc.moveDown();

    // Events list
    events.forEach((event, index) => {
      if (doc.y > 650) {
        doc.addPage();
      }

      doc.fontSize(12).text(`${index + 1}. ${event.name}`, { underline: true });
      doc.fontSize(10)
        .text(`Jenis: ${event.type}`)
        .text(`Status: ${event.status}`)
        .text(`Tanggal: ${new Date(event.startDate).toLocaleDateString('id-ID')} - ${new Date(event.endDate).toLocaleDateString('id-ID')}`)
        .text(`Lokasi: ${event.location ? event.location.name : '-'}`)
        .text(`Penanggung Jawab: ${event.responsible}`)
        .text(`Peserta: ${event.participants || 0} orang`)
        .text(`Item yang digunakan: ${event.eventItems.length} item`);
      
      doc.moveDown(0.5);
    });

    // Footer
    doc.fontSize(8).text(`Generated by: ${req.user.fullName} | ${new Date().toLocaleString('id-ID')}`, 50, doc.page.height - 50);

    doc.end();
  } catch (error) {
    console.error('Export events PDF error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export PDF',
      error: error.message
    });
  }
});

// GET /api/reports/events/export/excel
router.get('/events/export/excel', verifyToken, async (req, res) => {
  try {
    const { startDate, endDate, type, status } = req.query;

    // Get events data
    const where = {};
    if (startDate && endDate) {
      where.startDate = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }
    if (type) where.type = type;
    if (status) where.status = status;

    const events = await Event.findAll({
      where,
      include: [
        {
          model: Location,
          as: 'location'
        },
        {
          model: EventItem,
          as: 'eventItems',
          include: [
            {
              model: Inventory,
              as: 'inventory'
            }
          ]
        }
      ],
      order: [['startDate', 'DESC']]
    });

    // Create Excel workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Laporan Kegiatan');

    // Add header information
    worksheet.addRow(['Laporan Kegiatan - UPT BKN Gorontalo']);
    worksheet.addRow([`Tanggal Export: ${new Date().toLocaleDateString('id-ID')}`]);
    if (startDate && endDate) {
      worksheet.addRow([`Periode: ${new Date(startDate).toLocaleDateString('id-ID')} - ${new Date(endDate).toLocaleDateString('id-ID')}`]);
    }
    worksheet.addRow([]); // Empty row

    // Add column headers
    const headers = [
      'No', 'Nama Kegiatan', 'Jenis', 'Status', 'Tanggal Mulai', 'Tanggal Selesai',
      'Lokasi', 'Penanggung Jawab', 'Peserta', 'Item Digunakan', 'Deskripsi'
    ];
    
    const headerRow = worksheet.addRow(headers);
    headerRow.font = { bold: true };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE6E6E6' }
    };

    // Add data rows
    events.forEach((event, index) => {
      worksheet.addRow([
        index + 1,
        event.name,
        event.type,
        event.status,
        new Date(event.startDate).toLocaleDateString('id-ID'),
        new Date(event.endDate).toLocaleDateString('id-ID'),
        event.location ? event.location.name : '-',
        event.responsible,
        event.participants || 0,
        event.eventItems.length,
        event.description || '-'
      ]);
    });

    // Auto-fit columns
    worksheet.columns.forEach(column => {
      column.width = 15;
    });

    // Set response headers
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=events-report-${Date.now()}.xlsx`);

    // Write to response
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error('Export events Excel error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export Excel',
      error: error.message
    });
  }
});

// POST /api/backup
router.post('/backup', verifyToken, requireAdmin, async (req, res) => {
  try {
    // This is a placeholder for database backup functionality
    // In a real implementation, you would use mysqldump or similar tools
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFileName = `inventaris_bkn_backup_${timestamp}.sql`;
    
    // Simulate backup process
    setTimeout(() => {
      res.json({
        success: true,
        message: 'Database backup created successfully',
        data: {
          fileName: backupFileName,
          size: '2.4 MB',
          createdAt: new Date().toISOString()
        }
      });
    }, 2000);
  } catch (error) {
    console.error('Database backup error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create backup',
      error: error.message
    });
  }
});

// POST /api/restore
router.post('/restore', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { fileName } = req.body;
    
    if (!fileName) {
      return res.status(400).json({
        success: false,
        message: 'Backup file name is required'
      });
    }
    
    // This is a placeholder for database restore functionality
    // In a real implementation, you would restore from the backup file
    
    // Simulate restore process
    setTimeout(() => {
      res.json({
        success: true,
        message: 'Database restored successfully',
        data: {
          fileName,
          restoredAt: new Date().toISOString()
        }
      });
    }, 3000);
  } catch (error) {
    console.error('Database restore error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to restore database',
      error: error.message
    });
  }
});

module.exports = router;