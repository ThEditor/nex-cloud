import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { SongService } from './song.service';
import { JwtGuard } from 'src/auth/guard';

@Controller('songs')
export class SongController {
  constructor(private songService: SongService) {}

  @Get(':id')
  get(@Param('id', ParseIntPipe) id: number) {
    return this.songService.get(id);
  }

  @HttpCode(HttpStatus.OK)
  @Post('search')
  search(@Body('query') query: string) {
    return this.songService.search(query);
  }

  @UseGuards(JwtGuard)
  @Post('stream')
  stream(@Body('id', ParseIntPipe) id: number) {
    return this.songService.stream(id);
  }
}
