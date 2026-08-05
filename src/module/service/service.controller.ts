import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync.js";
import { serviceValidation } from "./service.validation.js";
import { serviceService } from "./service.service.js";
import sendResponse from "../../utils/sendResponse.js";

const createService = catchAsync(async (req, res) => {
  serviceValidation.vCreateService(req.body);

  const result = await serviceService.createService(req.user!.id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Service created successfully",
    data: result,
  });
});

const getAllServices = catchAsync(async (req, res) => {
  const result = await serviceService.getAllServices(req.query as any);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Services retrieved successfully",
    data: result,
    
  });
});

const getServiceById = catchAsync(async (req, res) => {
  const result = await serviceService.getServiceById(req.params.id as string);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Service retrieved successfully",
    data: result,
  });
});

const updateService = catchAsync(async (req, res) => {
  serviceValidation.vUpdateService(req.body);

  const result = await serviceService.updateService(req.user!.id, req.params.id as string, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Service updated successfully",
    data: result,
  });
});

const deleteService = catchAsync(async (req, res) => {
  await serviceService.deleteService(req.user!.id, req.params.id as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Service deleted successfully",
    data: null,
  });
});

export const serviceController = {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService,
};