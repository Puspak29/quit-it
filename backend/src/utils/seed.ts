import { prisma } from '../config/db';
import { type CommunityType } from '../types';

const COMMUNITIES: CommunityType[] = [
  { addictionType: 'smoking', name: 'Quit Smoking Together', description: 'Support for quitting cigarettes and nicotine.' },
  { addictionType: 'alcohol', name: 'Sober & Strong', description: 'Alcohol-free living support.' },
  { addictionType: 'porn', name: 'Reboot Community', description: 'NoFap and porn addiction recovery.' },
  { addictionType: 'social_media', name: 'Digital Detox', description: 'Breaking the scroll habit.' },
  { addictionType: 'custom', name: 'Custom Community', description: 'A community for custom addiction support.' },
  { addictionType: 'gambling', name: 'Gambling Recovery', description: 'Support for overcoming gambling addiction.' }
];

async function main() {
  for (const c of COMMUNITIES) {
    await prisma.community.upsert({
      where: { addictionType: c.addictionType },
      create: c,
      update: {},
    });
  }
  console.log('[db] Communities seeded.');
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error('[db] Error occurred while seeding communities:', e);
  process.exit(1);
});