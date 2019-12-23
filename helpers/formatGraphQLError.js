export default function formatGraphQLError(message = '') {
    return message.replace('GraphQL error: ', '')
}