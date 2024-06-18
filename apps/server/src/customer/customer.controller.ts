import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  Query,
} from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { ChangeCustomerStatusDto } from './dto/change-customer-status.dto';
import { CustomerStatus } from '@prisma/client';

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customerService.create(createCustomerDto);
  }

  @Get()
  async getCustomers(@Query('status') status?: CustomerStatus) {
    return this.customerService.getAllCustomers(status);
  }

  @Put('/status/:id')
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
  update(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    return this.customerService.update(+id, updateCustomerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.customerService.remove(+id);
  }
}
