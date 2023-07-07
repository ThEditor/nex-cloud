import { Injectable, NotFoundException, StreamableFile } from '@nestjs/common';
import { createReadStream, existsSync } from 'fs';
import { join } from 'path';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SongService {
  constructor(private prismaService: PrismaService) {}

  async get(id: number) {
    const song = await this.prismaService.song.findUnique({ where: { id } });
    if (!song) throw new NotFoundException("Couldn't find requested song");
    return { items: [song] };
  }

  async search(query: string) {
    const songs = await this.prismaService.song.findMany({
      where: {
        title: {
          search: query,
        },
      },
      take: 10,
    });
    if (!songs) throw new NotFoundException("Couldn't find requested song");
    return { items: songs };
  }

  async stream(id: number) {
    const song = await this.get(id);
    const file = join(
      process.cwd(),
      'private',
      'songs',
      `${song.items[0].id}.mp3`,
    );
    if (!existsSync(file))
      throw new NotFoundException("Couldn't find streamable file");
    return new StreamableFile(createReadStream(file));
  }
}
