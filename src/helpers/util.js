/**
 * Created by Adeyemi on 11/20/2018
 */

export class Utility{

  static sendSuccessResponse(res, data = [], statusCode, resStatus = 200){
    const responseData = {
      statusCode,
      data
    };

    return res.status(resStatus).json(responseData);
  }

  static sendErrorResponse(res, data = [], message, statusCode, resStatus = 400){
    const responseData = {
      statusCode,
      data,
      message
    };

    return res.status(resStatus).json(responseData);
  }

  static validParam(obj, requiredParam) {
    let objKeys = Object.keys(obj);
    let notFound = [];
    let success = true;

    requiredParam.forEach((param, index) => {
      let idx = objKeys.findIndex(k => {
        return k === param.name;
      });

      if (idx < 0) {
        notFound.push(`${param.name} is required`);
        success = false;
      } else if (param.type && (typeof obj[param.name] != param.type)) {
        notFound.push(`${param.name} should be ${param.type}`);
        success = false;
      }
    });

    return {
      success: success,
      message: notFound
    };
  }



}