import gql from "graphql-tag";

export const COMPANY_TITLE_FORM_MUTATION = gql`
  mutation PeopleTitleForm($input: UpdateOnePeopleInput!) {
    updateOnePeople(input: $input) {
      id
      name
      avatarUrl
      salesOwner {
        id
        name
        avatarUrl
      }
    }
  }
`;

export const COMPANY_TITLE_QUERY = gql`
  query PeopleTitle($id: ID!) {
    people(id: $id) {
      id
      name
      createdAt
      avatarUrl
      salesOwner {
        id
        name
        avatarUrl
      }
    }
  }
`;
