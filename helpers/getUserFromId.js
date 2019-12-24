export default function getUserFromId(id, client) {
	return client.users.get(id);
}