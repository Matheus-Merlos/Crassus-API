variable "domain" {
  type        = string
  description = "O nome do domínio da distribuição cloudfront"
}

variable "public_dns" {
  type        = string
  description = "O DNS o qual a distribuição cloudfront irá apontar"
}

variable "allowed_methods" {
  type        = list(string)
  default     = ["GET", "HEAD", "OPTIONS", "PUT", "POST", "PATCH", "DELETE"]
  description = "Quais métodos serão permitidos na distribuição"
}

variable "certificate_arn" {
  type        = string
  description = "ARN do certificado ACM"
}