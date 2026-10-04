import { Response, NextFunction, Request } from 'express';
import { prisma } from '../config/db.js';
import { AppError } from '../middlewares/errorHandler.js';

export async function createCheckout(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { slug } = req.params;
    const { items, customer, shippingAddress, shippingMethod, paymentMethod } = req.body;
    
    if (!items || items.length === 0) throw new AppError('Cart is empty', 400);

    const site = await prisma.site.findUnique({
      where: { slug },
      include: { storeSettings: true }
    });
    if (!site) throw new AppError('Store not found', 404);

    const storeSettings = site.storeSettings || { taxRate: 0, shippingRate: 0, freeShippingMin: null };

    // Validate products and compute total securely
    let subtotal = 0;
    const orderItemsData = [];
    
    for (const item of items) {
      const product = await prisma.product.findUnique({ where: { id: item.id } });
      if (!product || product.siteId !== site.id || product.status !== 'active') {
        throw new AppError(`Product ${item.id} not available`, 400);
      }
      if (product.stockQty < item.quantity) {
        throw new AppError(`Not enough stock for ${product.name}`, 400);
      }
      
      const price = product.discountPrice ?? product.price;
      subtotal += price * item.quantity;
      
      orderItemsData.push({
        productId: product.id,
        productName: product.name,
        priceAtPurchase: price,
        quantity: item.quantity,
      });
    }

    // Shipping logic
    let shippingCost = storeSettings.shippingRate;
    if (storeSettings.freeShippingMin && subtotal >= storeSettings.freeShippingMin) {
      shippingCost = 0;
    }
    if (shippingMethod === 'express') {
      shippingCost += 15.0; // Flat express rate
    }

    const taxCost = subtotal * (storeSettings.taxRate / 100);
    const total = subtotal + shippingCost + taxCost;
    
    const orderNumber = `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Create Order
    const order = await prisma.order.create({
      data: {
        siteId: site.id,
        orderNumber,
        status: 'pending',
        paymentMethod: paymentMethod || 'COD',
        paymentStatus: 'pending',
        subtotal,
        shipping: shippingCost,
        tax: taxCost,
        total,
        shippingAddress: JSON.stringify(shippingAddress),
        contactEmail: customer.email,
        contactPhone: customer.phone,
        items: {
          create: orderItemsData
        }
      }
    });

    // Deduct stock quantities
    for (const item of items) {
      await prisma.product.update({
        where: { id: item.id },
        data: {
          stockQty: { decrement: item.quantity }
        }
      });
    }

    res.status(201).json({ success: true, order, orderNumber });
  } catch (err) {
    next(err);
  }
}

export async function getOrders(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { slug } = req.params;
    
    const site = await prisma.site.findUnique({ where: { slug } });
    if (!site) throw new AppError('Site not found', 404);

    const orders = await prisma.order.findMany({
      where: { siteId: site.id },
      include: { items: true },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ success: true, orders });
  } catch (err) {
    next(err);
  }
}

export async function updateOrderStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { slug, orderId } = req.params;
    const { status, paymentStatus } = req.body;

    const site = await prisma.site.findUnique({ where: { slug } });
    if (!site) throw new AppError('Site not found', 404);

    const data: any = {};
    if (status) data.status = status;
    if (paymentStatus) data.paymentStatus = paymentStatus;

    const updated = await prisma.order.update({
      where: { id: orderId, siteId: site.id },
      data,
      include: { items: true }
    });

    res.json({ success: true, order: updated });
  } catch (err) {
    next(err);
  }
}

export async function createInquiry(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { slug } = req.params;
    const { name, email, phone, subject, message, metadata } = req.body;

    if (!name || !email || !message) {
      throw new AppError('Name, email, and message are required.', 400);
    }

    const site = await prisma.site.findUnique({ where: { slug } });
    if (!site) throw new AppError('Store not found', 404);

    const inquiry = await prisma.inquiry.create({
      data: {
        siteId: site.id,
        name: String(name).trim(),
        email: String(email).trim().toLowerCase(),
        phone: phone ? String(phone).trim() : null,
        subject: subject ? String(subject).trim() : null,
        message: String(message).trim(),
        metadata: metadata ? (typeof metadata === 'string' ? metadata : JSON.stringify(metadata)) : null,
        status: 'new',
      },
    });

    res.status(201).json({
      success: true,
      message: 'Inquiry received successfully.',
      inquiry,
    });
  } catch (err) {
    next(err);
  }
}

export async function getInquiries(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { slug } = req.params;

    const site = await prisma.site.findUnique({ where: { slug } });
    if (!site) throw new AppError('Store not found', 404);

    const inquiries = await prisma.inquiry.findMany({
      where: { siteId: site.id },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({
      success: true,
      inquiries,
    });
  } catch (err) {
    next(err);
  }
}

export async function updateInquiryStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { slug, inquiryId } = req.params;
    const { status } = req.body;

    const site = await prisma.site.findUnique({ where: { slug } });
    if (!site) throw new AppError('Store not found', 404);

    const updated = await prisma.inquiry.update({
      where: { id: inquiryId },
      data: { status },
    });

    res.status(200).json({
      success: true,
      inquiry: updated,
    });
  } catch (err) {
    next(err);
  }
}

