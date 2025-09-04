// export function removeSensitiveData(data: any) {
//   if (!data || typeof data !== 'object') return data;

//   if (Array.isArray(data)) {
//     return data.map((item) => removeSensitiveData(item));
//   }

//   const result: any = {};
//   for (const key in data) {
//     if (
//       key !== 'password' &&
//       key !== 'otp' &&
//       key !== 'otpExpiration'
//     ) {
//       result[key] =
//         typeof data[key] === 'object'
//           ? removeSensitiveData(data[key])
//           : data[key];
//     }
//   }
//   return result;
// }

export function removeSensitiveData(obj: any): void {
  if (Array.isArray(obj)) {
    // Process each item in the array
    obj.forEach((item) => removeSensitiveData(item));
  } else if (typeof obj === 'object' && obj !== null) {
    // Process each key in the object
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (key === 'password' || key === 'otp' || key === 'otpExpiration') {
          delete obj[key];
        } else {
          // Recursively process nested objects or arrays
          removeSensitiveData(obj[key]);
        }
      }
    }
  }
}
