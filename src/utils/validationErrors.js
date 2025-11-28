import Swal from "sweetalert2";

export const showValidationErrors = (errors) => {
  const errorMessages = Object.values(errors)
    .map((err) => `<li>${err.message}</li>`)
    .join("");

  Swal.fire({
    icon: "error",
    title: "Errores de validación",
    html: `<ul style="text-align: left;">${errorMessages}</ul>`,
    confirmButtonText: "Entendido",
  });
};
