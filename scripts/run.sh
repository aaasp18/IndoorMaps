#!/bin/bash
source /home/ubuntu/.bashrc

cd /home/ubuntu/app

pm2 start npm --name www -- start
