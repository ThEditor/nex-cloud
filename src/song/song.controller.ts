import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { SongService } from './song.service';
import { JwtGuard } from 'src/auth/guard';
import { PaginationDto } from './dto';

@Controller('songs')
export class SongController {
  constructor(private songService: SongService) {}

  @Get('search')
  search(@Query('query') query: string) {
    return this.songService.search(query);
  }

  @Get('latest')
  latest(@Query() { skip, limit }: PaginationDto) {
    return this.songService.latest(skip, limit);
  }

  @Get('recent')
  recent(@Query() { skip, limit }: PaginationDto) {
    return this.songService.recent(skip, limit);
  }

  @UseGuards(JwtGuard)
  @Post('stream')
  stream(@Body('id', ParseIntPipe) id: number) {
    return this.songService.stream(id);
  }

  @Get(':id')
  get(@Param('id', ParseIntPipe) id: number) {
    return this.songService.get(id);
  }
}
