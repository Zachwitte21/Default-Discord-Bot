import mongoose from 'mongoose';
import { TextChannel, Client } from 'discord.js';

const startDbListener = (client: Client, channelId: string) => {
  const announcementSchema = new mongoose.Schema({ title: String, body: String });
  const Announcement = mongoose.model('Announcement', announcementSchema);

  const announcementStream = Announcement.watch();

  announcementStream.on('change', async (change) => {
    if (change.operationType === 'insert') {
      const newAnnouncement = change.fullDocument;
      const channel = await client.channels.fetch(channelId) as TextChannel;
      channel.send(`📢 New Announcement: ${newAnnouncement.title}\n${newAnnouncement.body}`);
    }
  });

  announcementStream.on('error', (error) => {
    console.error('Error in MongoDB change stream:', error);
  });
};

export default startDbListener;
