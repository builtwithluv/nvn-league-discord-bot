export default function getUserFromMention(mention, client) {
	const matches = mention.match(/^<@!?(\d+)>$/);

	if (!matches) return;

	const id = matches[1];

	return client.users.get(id);
}