resource "tls_private_key" "deployer_key" {
  algorithm = "RSA"
  rsa_bits  = 4096
}

resource "aws_key_pair" "deployer_key_pair" {
  key_name   = "crassus-key-pair"
  public_key = tls_private_key.deployer_key.public_key_openssh
}

resource "aws_instance" "crassus_server" {
  ami           = "ami-0789039e34e739d67" //Debian
  instance_type = "t4g.nano"
  key_name      = aws_key_pair.deployer_key_pair.key_name

  vpc_security_group_ids = [aws_security_group.ec2_security_group.id]

  tags = {
    Name       = "crassus-server"
    Auto-Start = true
  }
}

output "server_private_key" {
  value     = tls_private_key.deployer_key.private_key_pem
  sensitive = true
}

output "server_public_ip_address" {
  value     = aws_instance.crassus_server.public_ip
  sensitive = true
}