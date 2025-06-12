resource "cloudflare_dns_record" "api_dns_record" {
  zone_id = var.zone_id
  name    = "api"
  content = module.crassus_api_cdn.cloudfront_endpoint
  type    = "CNAME"
  proxied = false
  ttl     = 300
}
