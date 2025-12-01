import { z } from "zod";

export const fileSchema = z.any().refine((file) => {
  if (!file) return true;
  return file instanceof FileList || file instanceof File;
}, "Debe ser un archivo válido");

export const productoSchema = z.object({
  nombre: z
    .string()
    .min(1, "El nombre es requerido")
    .max(45, "El nombre no puede exceder los 45 caracteres")
    .trim(),
  descripcion: z
    .string()
    .max(300, "La descripción no puede exceder los 300 caracteres")
    .trim()
    .optional()
    .default(""),
  precio: z.coerce
    .number()
    .min(0, "El precio no puede ser negativo")
    .max(5000000, "El precio no puede exceder los 5.000.000"),
  categoria: z.string().optional().nullable(),
  stock: z.coerce
    .number()
    .int()
    .min(0, "El stock no puede ser negativo")
    .max(2500, "El stock no puede exceder los 2500")
    .default(0),

  imagen: fileSchema,
  disponible: z.boolean().optional().default(true),
});

export const promocionSchema = z
  .object({
    titulo: z.string().min(1, "El título es requerido").trim(),
    descripcion: z.string().min(1, "La descripción es requerida").trim(),
    descuento: z.coerce
      .number()
      .min(1, "El descuento mínimo es 1%")
      .max(100, "El descuento máximo es 100%"),
    fechaInicio: z.string().min(1, "La fecha de inicio es requerida"),
    fechaFin: z.string().min(1, "La fecha de fin es requerida"),
    imagen: fileSchema,
  })
  .refine(
    (data) => {
      if (!data.fechaInicio || !data.fechaFin) return true;
      return new Date(data.fechaFin) > new Date(data.fechaInicio);
    },
    {
      message: "La fecha de fin debe ser posterior a la fecha de inicio",
      path: ["fechaFin"],
    }
  );

const onlyValidCharsRegex = /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ.,!?\s-]+$/;
const noEmojiRegex = /^[^\p{Emoji}]+$/u;
const noRepetitionsRegex = /(.)\1{3,}/;
const badWords = ["puta", "puto", "mierda", "fuck", "pedo"];

export const reviewSchema = z.object({
  user: z
    .string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(25, "El nombre no puede exceder los 25 caracteres")
    .trim()
    .regex(onlyValidCharsRegex, "Caracteres inválidos en el nombre")
    .regex(noEmojiRegex, "No se permiten emojis en el nombre")
    .refine((val) => !noRepetitionsRegex.test(val), {
      message: "No repitas caracteres más de 3 veces en el nombre",
    })
    .refine((val) => !badWords.some((w) => val.toLowerCase().includes(w)), {
      message: "Lenguaje inapropiado en el nombre",
    }),
  rating: z.coerce
    .number()
    .min(1, "La calificación mínima es 1")
    .max(5, "La calificación máxima es 5"),
  comment: z
    .string()
    .min(10, "El comentario debe tener al menos 10 caracteres")
    .max(300, "El comentario no puede exceder los 300 caracteres")
    .trim()
    .regex(onlyValidCharsRegex, "Caracteres inválidos en el comentario")
    .regex(noEmojiRegex, "No se permiten emojis en el comentario")
    .refine((val) => !noRepetitionsRegex.test(val), {
      message: "No repitas caracteres más de 3 veces en el comentario",
    })
    .refine((val) => !badWords.some((w) => val.toLowerCase().includes(w)), {
      message: "Lenguaje inapropiado en el comentario",
    }),
});

const objectIdRegex = /^[a-f\d]{24}$/i;
const isValidObjectId = (id) => objectIdRegex.test(id);

export const pedidoSchema = z.object({
  usuario: z
    .string()
    .min(1, "El usuario es requerido")
    .refine(isValidObjectId, "ID de usuario inválido"),
  productos: z
    .array(
      z.object({
        producto: z
          .string()
          .min(1, "El producto es requerido")
          .refine(isValidObjectId, "ID de producto inválido"),
        cantidad: z.coerce
          .number()
          .min(1, "La cantidad mínima es 1")
          .int("La cantidad debe ser un número entero"),
      })
    )
    .min(1, "El pedido debe tener al menos un producto"),
  direccion: z
    .string()
    .min(5, "La dirección debe tener al menos 5 caracteres")
    .trim(),
  total: z.coerce.number().min(0, "El total no puede ser negativo"),
  estado: z
    .enum(["pendiente", "procesando", "enviado", "entregado", "cancelado"])
    .optional()
    .default("pendiente"),
});
