// Public visitor destinations only. Keep this browser contract testable against
// the server transport so adding a navigation link cannot discard its answer.
const site=/^https:\/\/(?:mapsycoy\.github\.io|mapsycoy\.com)\/(?:ko\/)?(?:|cv\/|works\/|works\/[a-z0-9-]+\/|blog\/(?:[0-9]+\/|notes\/[a-z0-9-]+\/)?)$/;
const tistory=/^https:\/\/mapsycoy\.tistory\.com\/(?:[0-9]+|notice\/[0-9]+)$/;
export const isPublicChatLink=value=>typeof value==='string'&&(site.test(value)||tistory.test(value)||value==='https://www.instagram.com/mapsycoy/');
