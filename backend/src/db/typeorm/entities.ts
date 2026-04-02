import { User } from '../../endpoint/auth/entities/user.entity';
import { Product } from '../../endpoint/products/entities/product.entity';
import { Order } from '../../endpoint/orders/entities/order.entity';
import { OrderItem } from '../../endpoint/orders/entities/order-item.entity';

export const ENTITIES = [User, Product, Order, OrderItem];
