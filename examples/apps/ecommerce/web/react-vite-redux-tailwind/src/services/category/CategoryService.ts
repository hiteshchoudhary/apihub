import ApiError from "../ApiError";
import ApiRequest from "../ApiRequest";
import ApiResponse from "../ApiResponse";
import { Categories, Category } from "./CategoryTypes";

class CategoryService {
  defaultPageNumber: number = 1;
  defaultPageLimit: number = 50;
  BASE_URL: string = "/api/v1/ecommerce/categories";

  /* Get All Categories Asynchronously: As the requests keep fulfilling response will be sent as callback */
  async getAllCategoriesAsync(
    callback: (data: Category[], isDone: boolean, errorMessage?: ApiError) => void
  ) {
    /* API Request */
    const apiRequest = new ApiRequest(this.BASE_URL);

    /* Initializing Page Number Counter */
    let pageNumberCounter = this.defaultPageNumber;

    /* First Request to know the total pages */
    const firstResponse = await apiRequest.getRequest<Categories>({
      page: pageNumberCounter,
      limit: this.defaultPageLimit,
    });

    /* If the first request is successful */
    if (firstResponse instanceof ApiResponse && firstResponse.success) {
      /* Total Number of Pages */
      const totalPages = firstResponse.data.totalPages;

      /* Incrementing page counter */
      pageNumberCounter++;

      /* Number of requests to be made, adding 1 as pageNumberCounter has been incremented above */
      let requestsPending = totalPages - pageNumberCounter + 1;

      /* If first request is the last request: return */
      if (!requestsPending) {
        return callback(firstResponse.data.categories, true);
      } else {
        callback(firstResponse.data.categories, false);
      }

      /* Remaining requests made in parallel */
      for (let counter = pageNumberCounter; counter <= totalPages; counter++) {
        apiRequest
          .getRequest<Categories>({
            page: counter,
            limit: this.defaultPageLimit,
          })
          .then((res) => {
            /* Decrementing pending requests count */
            requestsPending--;

            /* Error in response: Return */
            if (!(res instanceof ApiResponse && res.success)) {
              return res instanceof ApiError
                ? callback([], true, res)
                : callback([], true, new ApiError(res.message));
            } else if (!requestsPending) {
              /* All Requests are done */
              return callback(res.data.categories, true);
            } else {
              /* Sending the data of an in between request */
              callback(res.data.categories, false);
            }
          });
      }
    } else {
      // Error
      return firstResponse instanceof ApiError
        ? callback([], true, firstResponse)
        : callback([], true, new ApiError(firstResponse.message));
    }
  }
}

export default new CategoryService();
