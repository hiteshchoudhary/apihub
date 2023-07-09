import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const getResponseHeaders = asyncHandler(async (req, res) => {
  res.set({
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": "280",
    etag: "12345",
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { headers: res.getHeaders() },
        "Response headers returned"
      )
    );
});

/**
 * @description `Cache-control` is an HTTP header used to specify browser caching policies in both client requests and server responses. Policies include how a resource is cached, where it’s cached and its maximum age before expiring (i.e., time to live)
 * For example,
 * - cache-control: max-age=120 means that the returned resource is valid for 120 seconds, after which the browser has to request a newer version.
 */
const setCacheControlHeader = asyncHandler(async (req, res) => {
  const { timeToLive, cacheResponseDirective } = req.params;
  res.set(
    // The `public` (cacheResponseDirective) response directive indicates that a resource can be cached by any cache.
    // The `private` (cacheResponseDirective) response directive indicates that a resource is user specific—it can still be cached, but only on a client device. For example, a web page response marked as private can be cached by a desktop browser, but not a content delivery network (CDN).
    "Cache-Control",
    `${cacheResponseDirective}, max-age=${timeToLive}`
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { headers: res.getHeaders() },
        "Cache control header has been set"
      )
    );
});

const sendHTMLTemplate = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .set("content-type", "text/html")
    .sendFile("/public/assets/templates/html_response.html", {
      root: "./",
    });
});

const sendXMLData = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .set("content-type", "application/xml")
    .sendFile("/public/assets/templates/xml_response.xml", {
      root: "./",
    });
});

const sendGzipResponse = asyncHandler(async (req, res) => {
  // This controller is guarded by compression middleware which compresses the response
  const animal = "elephant";
  // It will repeatedly send the word 'elephant' in a
  // 'text/html' format file
  res.status(200).send(
    new ApiResponse(
      200,
      {
        contentEncoding: "gzip",
        string: animal.repeat(1000),
      },
      "Response compressed with gzip"
    )
  );
});

const sendBrotliResponse = asyncHandler(async (req, res) => {
  // This controller is guarded by compression middleware which compresses the response in `br` encoding
  const animal = "elephant";
  res.status(200).send(
    new ApiResponse(
      200,
      {
        contentEncoding: "br",
        string: animal.repeat(1000),
      },
      "Response compressed with brotli"
    )
  );
});

export {
  getResponseHeaders,
  setCacheControlHeader,
  sendHTMLTemplate,
  sendXMLData,
  sendGzipResponse,
  sendBrotliResponse,
};
