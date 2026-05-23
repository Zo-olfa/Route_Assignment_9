export const validationMiddleware = async (request, response, next) => {
  try {
    const { phone, password } = request.body || {};
    const method = request.method;

    // handle password validation "avoid validation when update user"
    if (password && method === "POST") {
      if (password.length < 8) {
        throw new Error("Password must be at least 8 characters long");
      } else if (password.length > 30) {
        throw new Error("Password must be less than 30 characters long");
      } else {
        const passwordRegex = /^[a-zA-Z0-9*.+-@]{8,30}$/;
        if (!passwordRegex.test(password)) {
          throw new Error(
            "Password is weak! Must contain mix of uppercase, lowercase, numbers and special characters(*.+-@)",
          );
        }
      }
    }

    // handle phone validation
    if (phone) {
      const phoneRegex = /^01[0125][\s-]?[0-9]{4}[\s-]?[0-9]{4}$/;
      if (!phoneRegex.test(phone)) {
        throw new Error("Phone number is not valid egyptian number EX: 012-3456-7890");
      } else {
        request.body.phone = phone.replaceAll(" ", "").replaceAll("-", "");
      }
    }

    next();
  } catch (error) {
    return response.status(422).json({ status: "error", message: error.message });
  }
};
