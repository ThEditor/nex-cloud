import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { SongService } from './song.service';
import { PaginationDto } from './dto';
import { Public } from 'src/auth/decorator';

@Controller('songs')
export class SongController {
  constructor(private songService: SongService) {}

  @Public()
  @Get('search')
  search(@Query('query') query: string) {
    return this.songService.search(query);
  }

  @Public()
  @Get('latest')
  latest(@Query() { skip, limit }: PaginationDto) {
    return this.songService.latest(skip, limit);
  }

  @Public()
  @Get('recent')
  recent(@Query() { skip, limit }: PaginationDto) {
    return this.songService.recent(skip, limit);
  }

  @Post('stream')
  stream(@Body('id', ParseIntPipe) id: number) {
    return this.songService.stream(id);
  }

  @Public()
  @Get(':id')
  get(@Param('id', ParseIntPipe) id: number) {
    return this.songService.get(id);
  }
}
