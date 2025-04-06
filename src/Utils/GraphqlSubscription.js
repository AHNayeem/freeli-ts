import { gql } from '@apollo/client';
import { msgSchema } from './GraphqlQueries';
// Define mutation
export const NEW_MESSAGE_SUBSCRIPTION = gql`
subscription new_message {
    new_message{
        msg${msgSchema}
    }
}
`;