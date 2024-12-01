import {
  AddEditProductFieldsForService,
  EditProductFieldsForService,
} from "../../constants";
import { generateRandomNumber } from "../../utils/commonHelper";
import ApiError from "../ApiError";
import ApiRequest from "../ApiRequest";
import ApiResponse from "../ApiResponse";
import { Product, Products } from "./ProductTypes";

class ProductService {
  defaultPageNumber: number = 1;
  defaultPageLimit: number = 30;
  BASE_URL: string = "/api/v1/ecommerce/products";
  CATEGORY_WISE_URL: string = "/api/v1/ecommerce/products/category";

  async getTopProducts(
    numberOfProducts: number
  ): Promise<Product[] | ApiError> {
    const apiRequest = new ApiRequest(this.BASE_URL);

    const response = await apiRequest.getRequest<Products>({
      page: this.defaultPageNumber,
      limit: this.defaultPageLimit,
    });

    if (response instanceof ApiResponse && response.success) {
      const products = response.data.products;
      /* Shuffling the products */
      products.sort(() => Math.random() - 0.5);
      const featuredProducts = products.slice(0, numberOfProducts);
      return featuredProducts;
    } else if (response instanceof ApiResponse) {
      return new ApiError(response.message);
    } else {
      return response;
    }
  }

  async getTopOnSaleProducts(
    numberOfProducts: number
  ): Promise<Product[] | ApiError> {
    const apiRequest = new ApiRequest(this.BASE_URL);

    const response = await apiRequest.getRequest<Products>({
      page: this.defaultPageNumber,
      limit: this.defaultPageLimit,
    });

    if (response instanceof ApiResponse && response.success) {
      const products = response.data.products;

      /* Shuffling the products list */
      products.sort(() => Math.random() - 0.5);

      const bestSellingProducts: Product[] = [];

      for (let counter = 0; counter < numberOfProducts; counter++) {
        /* Generating random discount percent */
        const discountPercent = generateRandomNumber(10, 20);

        /* Calculating price before discount: ((100 * current price) / (100 - discount percentage)) */
        products[counter].previousPrice = Math.round(
          (100 * products[counter].price) / (100 - discountPercent)
        );

        /* Pushing to best selling products list */
        bestSellingProducts.push(products[counter]);
      }

      return bestSellingProducts;
    } else if (response instanceof ApiResponse) {
      return new ApiError(response.message);
    } else {
      return response;
    }
  }

  async getProducts(
    pageNumber: number,
    categoryId?: string
  ): Promise<Products | ApiError> {
    /* 
       If categoryId is passed, get products for the particular category, 
       else get all the products 
    */
    const url = categoryId
      ? `${this.CATEGORY_WISE_URL}/${categoryId}`
      : this.BASE_URL;

    const apiRequest = new ApiRequest(url);

    const response = await apiRequest.getRequest<Products>({
      page: pageNumber,
      limit: this.defaultPageLimit,
    });

    if (response instanceof ApiResponse && response.success) {
      const productsResponse = response.data;
      return new Products(
        productsResponse.products,
        productsResponse.totalProducts,
        productsResponse.limit,
        productsResponse.page,
        productsResponse.totalPages,
        productsResponse.serialNumberStartFrom,
        productsResponse.hasPrevPage,
        productsResponse.hasNextPage,
        productsResponse.prevPage,
        productsResponse.nextPage,
        productsResponse.category
      );
    } else if (response instanceof ApiResponse) {
      /* Error */
      return new ApiError(response.message);
    } else {
      return response;
    }
  }

  async getAllProductsAsync(
    callback: (
      data: Array<Product>,
      isDone: boolean,
      error?: ApiError,
      categoryInfo?: { _id: string; name: string }
    ) => void,
    categoryId?: string
  ) {
    /* 
       If categoryId is passed, get products for the particular category, 
       else get all the products 
    */
    const url = categoryId
      ? `${this.CATEGORY_WISE_URL}/${categoryId}`
      : this.BASE_URL;

    /* ApiRequest Object */
    const apiRequest = new ApiRequest(url);

    let page = this.defaultPageNumber;
    /* First Request */
    const firstResponse = await apiRequest.getRequest<Products>({
      page,
      limit: this.defaultPageLimit,
    });

    if (firstResponse instanceof ApiResponse && firstResponse.success) {
      /* Pending requests */
      const totalPages = firstResponse.data.totalPages;

      page++;

      let requestsPending = totalPages - page + 1;

      /* If no requests are pending return else send intermediate response */
      if (!requestsPending) {
        return callback(
          firstResponse.data.products,
          true,
          undefined,
          firstResponse.data.category
        );
      } else {
        callback(
          firstResponse.data.products,
          false,
          undefined,
          firstResponse.data.category
        );
      }
      for (let counter = page; counter <= totalPages; counter++) {
        apiRequest
          .getRequest<Products>({ page: counter, limit: this.defaultPageLimit })
          .then((response) => {
            /* Decrementing pending requests count */
            requestsPending--;

            /* Error in request: Return */
            if (!(response instanceof ApiResponse && response.success)) {
              return response instanceof ApiError
                ? callback([], true, response)
                : callback([], true, new ApiError(response.message));
            } else if (!requestsPending) {
              /* All Requests are done */
              return callback(
                response.data.products,
                true,
                undefined,
                response.data.category
              );
            } else {
              /* Sending the data of an in between request */
              callback(
                response.data.products,
                false,
                undefined,
                response.data.category
              );
            }
          });
      }
    } else {
      /* Error */
      return firstResponse instanceof ApiError
        ? callback([], true, firstResponse)
        : callback([], true, new ApiError(firstResponse.message));
    }
  }

  async getProduct(productId: string): Promise<Product | ApiError> {
    const apiRequest = new ApiRequest(`${this.BASE_URL}/${productId}`);

    const response = await apiRequest.getRequest<Product>();

    if (response instanceof ApiResponse && response.success) {
      return response.data;
    } else if (response instanceof ApiResponse) {
      return new ApiError(response.message);
    } else {
      return response;
    }
  }

  async getRelatedProducts(
    categoryId: string,
    numberOfProducts: number
  ): Promise<Product[] | ApiError> {
    const apiRequest = new ApiRequest(
      `${this.CATEGORY_WISE_URL}/${categoryId}`
    );

    const response = await apiRequest.getRequest<Products>();

    if (response instanceof ApiResponse && response.success) {
      const products = response.data.products;

      //Shuffle
      products.sort(() => Math.random() - 0.5);

      const relatedProducts = products.splice(0, numberOfProducts);

      return relatedProducts;
    } else if (response instanceof ApiResponse) {
      return new ApiError(response.message);
    } else {
      return response;
    }
  }

  async addProduct(
    fields: AddEditProductFieldsForService
  ): Promise<Product | ApiError> {
    const apiRequest = new ApiRequest(this.BASE_URL);

    /* Form data as body */
    const productFormData = new FormData();
    productFormData.append("name", fields.name);
    productFormData.append("description", fields.description);
    productFormData.append("price", fields.price.toString());
    productFormData.append("stock", fields.stock.toString());
    productFormData.append("category", fields.category.id as string);
    productFormData.append("mainImage", fields.mainImage);

    fields.subImages.forEach((subImage) => {
      productFormData.append("subImages", subImage);
    });

    /* API Call */
    const response = await apiRequest.postRequest<Product>(productFormData);

    if (response instanceof ApiResponse && response.success) {
      return response.data;
    } else if (response instanceof ApiResponse) {
      return new ApiError(response.message);
    }
    return response;
  }

  /* Edit Product */
  async editProduct(
    fields: EditProductFieldsForService,
    productId: string
  ): Promise<Product | ApiError> {
    const apiRequest = new ApiRequest(`${this.BASE_URL}/${productId}`);

    /* Form data */
    const formData = new FormData();

    let key: keyof typeof fields;
    for (key in fields) {
      const value = fields[key];
      if (value !== undefined) {
        /* For string types: name, description */

        if (typeof value === "string") {
          formData.append(key, value);
        } 
        else if (typeof value === "number") {
        /* Number types: price, stock */

          formData.append(key, value.toString());
        } 
        else if (

        /* Category */
          "id" in value &&
          "text" in value &&
          typeof value.id === "string"
        ) 
        {
          /* Dropdown Item */
          formData.append(key, value.id);
        } 
        else if (value instanceof File) {
          /* mainImage */
          formData.append(key, value);
        } 
        else if (Array.isArray(value)) {
        /* Sub Images */
          value.forEach((subImage) => {
            formData.append(key, subImage);
          });
        }
      }
    }

    const response = await apiRequest.patchRequest<Product>(formData);
    if (response instanceof ApiResponse && response.success) {
      return response.data;
    } else if (response instanceof ApiResponse) {
      return new ApiError(response.message);
    }

    return response;
  }

  /* Remove a sub image of the product */
  async removeSubImageOfProduct(
    subImageId: string,
    productId: string
  ): Promise<Product | ApiError> {
    const apiRequest = new ApiRequest(
      `${this.BASE_URL}/remove/subimage/${productId}/${subImageId}`
    );

    const response = await apiRequest.patchRequest<Product>({});

    if (response instanceof ApiResponse && response.success) {
      return response.data;
    } else if (response instanceof ApiResponse) {
      return new ApiError(response.message);
    }
    return response;
  }

  async deleteProduct(productId: string): Promise<Product | ApiError> {
    const apiRequest = new ApiRequest(`${this.BASE_URL}/${productId}`);

    const response = await apiRequest.deleteRequest<{
      deletedProduct: Product;
    }>();

    if (response instanceof ApiResponse && response.success) {
      return response.data.deletedProduct;
    } else if (response instanceof ApiResponse) {
      return new ApiError(response.message);
    }
    return response;
  }
}

export default new ProductService();
