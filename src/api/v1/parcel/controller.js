/**
 * Created by Adeyemi on 11/24/2018
 */
import validator from "validator";
import {Utility} from "../../../helpers/util";
import {statusCode} from "../../../constants";
import {User} from "../../../models/user";
import {Parcel} from "../../../models/parcel";
import {ParcelProvider} from "../../../model-providers/parcel_provider";

const statusUpdate = [
	"transiting", "delivered"
];

export const getAllParcels = (req, res, next) => {
	ParcelProvider.getAllParcel((err, parcels) => {
		if (err) return next();
		if (parcels) {
			return Utility.sendSuccessResponse(res, parcels, statusCode.SUCCESS);
		} else {
			return Utility.sendErrorResponse(res, {}, "Oops! omething went wrong", statusCode.ERROR);
		}
	});
};

export const getUserParcels = (req, res, next) => {
	if (req.params.id) {
		ParcelProvider.getUserParcels(req.params.id, (err, parcels) => {
			if (err) return next();
			if (parcels) {
				return Utility.sendSuccessResponse(res, parcels, statusCode.SUCCESS);
			} else {
				return Utility.sendErrorResponse(res, {}, "Oops! something went wrong", statusCode.ERROR);
			}
		});
	} else {
		return Utility.sendErrorResponse(res, {}, "User id is not specified", statusCode.ERROR);
	}
};

export const getParcelById = (req, res, next) => {
	if (req.params.id) {
		ParcelProvider.getParcelById(req.params.id, (err, parcels) => {
			if (err) return next();
			if (parcels) {
				return Utility.sendSuccessResponse(res, parcels, statusCode.SUCCESS);
			} else {
				return Utility.sendErrorResponse(res, {}, "Oops! something went wrong", statusCode.ERROR);
			}
		});
	} else {
		return Utility.sendErrorResponse(res, {}, "Parcel id is not specified", statusCode.ERROR);
	}
};

export const cancelParcel = (req, res, next) => {
	if (req.params.id) {
		ParcelProvider.changeParcelStatus(req.params.id, "canceled", (err, parcels) => {
			if (err) return next();
			if (parcels) {
				return Utility.sendSuccessResponse(res, {id: req.params.id, message: "order canceled"}, statusCode.UPDATED);
			} else {
				return Utility.sendErrorResponse(res, {}, "Oops! something went wrong", statusCode.ERROR);
			}
		});
	} else {
		return Utility.sendErrorResponse(res, {}, "Parcel id is not specified", statusCode.ERROR);
	}
};

export const createParcelOrder = (req, res, next) => {
	if (!isAuthenticated(req.payload)) {
		return Utility.sendErrorResponse(res, {}, "User could not be determined", statusCode.UNAUTHORIZED);
	}

	let body = req.body;
	const required = [
		{name: "weight", type: "number"},
		{name: "weightmetric", type: "string"},
		{name: "fromlocation", type: "string"},
		{name: "tolocation", type: "string"},
	];

	const verify = Utility.validParam(body, required);
	if (verify.success) {

		User.getUserByUsername(req.payload.username, (err, user) => {
			console.log(err);
			if (err) return next();
			if (user) {
				body.placedBy = user.id;
				body.currentLocation = body.fromlocation;

				let newParcel = new Parcel(body);
				newParcel.createParcel((err, created) => {
					console.log(err);
					if (err) return next();

					if (created) {
						return Utility.sendSuccessResponse(res, newParcel, statusCode.CREATED);
					} else {
						return Utility.sendErrorResponse(res, {}, "Oops! Something went wrong when creating parcel", statusCode.ERROR);
					}
				});

			} else {
				return Utility.sendErrorResponse(res, {}, "User not found", statusCode.ERROR);
			}
		});
	} else {
		return Utility.sendErrorResponse(res, body, verify.message, statusCode.ERROR);
	}
};

export const changeParcelDestination = (req, res, next) => {
	if (req.params.id) {
		if (!req.body.tolocation) {
			return Utility.sendErrorResponse(res, {}, "fromlocation is required to change the destination", statusCode.ERROR);
		}
		ParcelProvider.changeParcelDestination(req.params.id, req.body.tolocation, (err, parcels) => {
			if (err) return next();
			if (parcels) {
				return Utility.sendSuccessResponse(res, {
					id: req.params.id,
					to: req.body.tolocation,
					message: "Parcel destination updated"
				}, statusCode.UPDATED);
			} else {
				return Utility.sendErrorResponse(res, {}, "Oops! something went wrong", statusCode.ERROR);
			}
		});
	} else {
		return Utility.sendErrorResponse(res, {}, "Parcel id is not specified", statusCode.ERROR);
	}
};

export const changeParcelStatus = (req, res, next) => {
	if (req.params.id) {

		console.log(req.payload);

		if (!isAdmin(req.payload)) {
			return Utility.sendErrorResponse(res, {}, "Sorry! only admin can change this", statusCode.ERROR);
		}

		if (!req.body.status) {
			return Utility.sendErrorResponse(res, {}, "status is required", statusCode.ERROR);
		}

		if (!statusUpdate.includes(req.body.status)) {
			return Utility.sendErrorResponse(res, {}, `status can only be in ${statusUpdate.join(" or ")}`, statusCode.ERROR);
		}

		ParcelProvider.getParcelById(req.params.id, (err, parcels) => {
			if (err) return next();

			console.log(parcels);
			let parcel = parcels[0];

			if (parcel) {
				if (parcel.status === "placed" && req.body.status === "delivered") {
					return Utility.sendErrorResponse(res, {}, "Oops! cannot set to delivered. Set to transiting first", statusCode.ERROR);
				}

				if (parcel.status === "delivered") {
					return Utility.sendErrorResponse(res, {}, "Oops! Parcel has been set to delivered", statusCode.ERROR);
				}

				ParcelProvider.changeParcelStatus(req.params.id, req.body.status, (err, parcels) => {
					if (err) return next();
					if (parcels) {
						return Utility.sendSuccessResponse(res, {
							id: req.params.id,
							status: req.body.status,
							message: "Parcel status updated"
						}, statusCode.UPDATED);
					} else {
						return Utility.sendErrorResponse(res, {}, "Oops! something went wrong", statusCode.ERROR);
					}
				});

			} else {
				return Utility.sendErrorResponse(res, {}, "Oops! Parcel not found", statusCode.ERROR);
			}
		});
	} else {
		return Utility.sendErrorResponse(res, {}, "Parcel id is not specified", statusCode.ERROR);
	}
};

export const changeParcelLocation = (req, res, next) => {
	if (req.params.id) {

		console.log(req.payload);

		if (!isAdmin(req.payload)) {
			return Utility.sendErrorResponse(res, {}, "Sorry! only admin can change this", statusCode.ERROR);
		}

		if (!req.body.currentlocation) {
			return Utility.sendErrorResponse(res, {}, "currentlocation is required to change the location", statusCode.ERROR);
		}

		ParcelProvider.changeParcelLocation(req.params.id, req.body.currentlocation, (err, parcels) => {
			if (err) return next();
			if (parcels) {
				return Utility.sendSuccessResponse(res, {
					id: req.params.id,
					currentLocation: req.body.currentlocation,
					message: "Parcel location updated"
				}, statusCode.UPDATED);
			} else {
				return Utility.sendErrorResponse(res, {}, "Oops! something went wrong", statusCode.ERROR);
			}
		});

	} else {
		return Utility.sendErrorResponse(res, {}, "Parcel id is not specified", statusCode.ERROR);
	}
};

function isAuthenticated(payload) {
	return !!(payload && payload.username);
}

function isAdmin(payload) {
	return !!payload.isAdmin;
}