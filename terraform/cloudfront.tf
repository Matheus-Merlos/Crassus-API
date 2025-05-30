module "crassus-api-cloudfront" {
  source = "./modules/cloudfront-distribution"

  domain          = "api.test.crassus.app.br"
  public_dns      = aws_instance.crassus_server.public_dns
  certificate_arn = aws_acm_certificate.wildcard_test_certificate.arn
}