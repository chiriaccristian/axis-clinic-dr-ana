import express from 'express';
import { join } from 'node:path';
import { connectDb, readDbConfig } from '@org/api-data';
import { ProductsService } from '@org/api-products';
import {
  ApiResponse,
  Product,
  ProductFilter,
  PaginatedResponse,
} from '@org/models';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3333;

const app = express();
const productsService = new ProductsService();

// Middleware
app.use(express.json());

// CORS configuration for React app
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept',
  );
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.get('/', (req, res) => {
  res.send({ message: 'Hello API' });
});

// Products endpoints
app.get('/api/products', (req, res) => {
  try {
    const filter: ProductFilter = {};

    if (req.query.category) {
      filter.category = req.query.category as string;
    }
    if (req.query.minPrice) {
      filter.minPrice = Number(req.query.minPrice);
    }
    if (req.query.maxPrice) {
      filter.maxPrice = Number(req.query.maxPrice);
    }
    if (req.query.inStock !== undefined) {
      filter.inStock = req.query.inStock === 'true';
    }
    if (req.query.searchTerm) {
      filter.searchTerm = req.query.searchTerm as string;
    }

    const page = req.query.page ? Number(req.query.page) : 1;
    const pageSize = req.query.pageSize ? Number(req.query.pageSize) : 10;

    const result = productsService.getProducts(filter, page, pageSize);

    const response: ApiResponse<PaginatedResponse<Product>> = {
      data: result,
      success: true,
    };

    res.json(response);
  } catch {
    const response: ApiResponse<null> = {
      data: null,
      success: false,
      error: 'An error occurred while fetching products',
    };
    res.status(500).json(response);
  }
});

app.get('/api/products/categories', (req, res) => {
  try {
    const categories = productsService.getCategories();
    const response: ApiResponse<string[]> = {
      data: categories,
      success: true,
    };
    res.json(response);
  } catch {
    const response: ApiResponse<null> = {
      data: null,
      success: false,
      error: 'An error occurred while fetching categories',
    };
    res.status(500).json(response);
  }
});

app.get('/api/products/:id', (req, res) => {
  try {
    const product = productsService.getProductById(req.params.id);

    if (!product) {
      const response: ApiResponse<null> = {
        data: null,
        success: false,
        error: 'Product not found',
      };
      return res.status(404).json(response);
    }

    const response: ApiResponse<Product> = {
      data: product,
      success: true,
    };
    return res.json(response);
  } catch {
    const response: ApiResponse<null> = {
      data: null,
      success: false,
      error: 'An error occurred while fetching the product',
    };
    return res.status(500).json(response);
  }
});

// The database is optional until every environment has one
// (deploy/cloud-run/README.md, "Database and medical files").
async function start() {
  const dbConfig = readDbConfig(process.env);
  if (dbConfig) {
    const connection = await connectDb(dbConfig);
    await connection.migrate(join(__dirname, 'migrations'));
  }
  app.listen(port, host, () => {
    console.log(`[ ready ] http://${host}:${port}`);
  });
}

start().catch((err: unknown) => {
  console.error(
    '[ error ] API failed to start',
    err instanceof Error ? err.message : err,
  );
  process.exit(1);
});
