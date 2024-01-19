output "instance_public_ip" {
  value     = aws_instance.servernode.public_ip
  sensitive = false
}