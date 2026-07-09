import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { AuditService } from './audit.service';

@Controller('audit')
@UseGuards(JwtAuthGuard)
export class AuditController {
  constructor(private auditService: AuditService) {}

  @Get('logs')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async getLogs(@Query('skip') skip = 0, @Query('limit') limit = 50) {
    return this.auditService.getLogs(skip, limit);
  }
}
