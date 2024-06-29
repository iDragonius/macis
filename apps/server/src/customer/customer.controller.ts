import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { ChangeCustomerStatusDto } from './dto/change-customer-status.dto';
import { CustomerStatus } from '@prisma/client';
import { Roles } from '../core/decorators/roles.decorator';
import { Role } from '../core/enums/role.enum';

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  async createCustomer(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customerService.createCustomer(createCustomerDto);
  }

  @Get()
  async getCustomers(@Query('status') status?: CustomerStatus) {
    return this.customerService.getAllCustomers(status);
  }

  @Put('/status/:id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  async changeCustomerStatus(
    @Body() changeCustomerStatusDto: ChangeCustomerStatusDto,
    @Param('id') id: string,
  ) {
    return this.customerService.changeCustomerStatus(
      id,
      changeCustomerStatusDto,
    );
  }

  @Get(':id')
  getCustomer(@Param('id') id: string) {
    return this.customerService.getCustomer(id);
  }

  @Patch(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  updateCustomer(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    return this.customerService.updateCustomer(id, updateCustomerDto);
  }

  @Delete(':id')
  @Roles(Role.SUPER_ADMIN)
  deleteCustomer(@Param('id') id: string) {
    return this.customerService.deleteCustomer(id);
  }
}
