module "crassus_api_cdn" {
  source = "./modules/cloudfront-distribution"

  domain          = "api.crassus.app.br"
  public_dns      = aws_instance.crassus_server.public_dns
  certificate_arn = aws_acm_certificate.wildcard_certificate.arn
}