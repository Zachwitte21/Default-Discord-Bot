import mongoose from 'mongoose';
import { TextChannel, Client, EmbedBuilder, AttachmentBuilder } from 'discord.js';

const startDbListener = (client: Client, channelId: string) => {
  const announcementSchema = new mongoose.Schema({ title: String, message: String, createdBy: String });
  const Announcement = mongoose.model('Announcement', announcementSchema);

  const announcementStream = Announcement.watch();

  // Needed Code to Setup the Image
  const imagePath = './assets/udesportslogo.png';
  const attachment = new AttachmentBuilder(imagePath, { name: 'udesportslogo.png' }); // Specify the name explicitly

  announcementStream.on('change', async (change) => {
    if (change.operationType === 'insert') {
      const newAnnouncement = change.fullDocument;
      const channel = await client.channels.fetch(channelId) as TextChannel;

      const embed = new EmbedBuilder()
        .setAuthor({ 
          name: newAnnouncement?.createdBy || 'Unknown Author', 
          iconURL: 'attachment://udesportslogo.png'
        })
        .setTitle('New Announcement')
        .setDescription(newAnnouncement?.message || 'No message provided.')
        .setColor('Blue')
        .setTimestamp();

      await channel.send({ embeds: [embed], files: [attachment] });
    }
  });

  announcementStream.on('error', (error) => {
    console.error('Error in MongoDB change stream:', error);
  });
};

export default startDbListener;
