import gql from "graphql-tag";

const QUOTE_FRAGMENT = gql`
    fragment FileFields on File {
        id
        title
        status
        description
        subTotal
        total
        tax
        createdAt
        items {
            title
            unitPrice
            quantity
            discount
            totalPrice
        }
        company {
            id
            name
            country
            website
            avatarUrl
        }
        salesOwner {
            id
            name
        }
        contact {
            id
            name
        }
    }
`;

export const QUOTES_TABLE_QUERY = gql`
    query FilesTable(
        $filter: FileFilter!
        $sorting: [FileSort!]!
        $paging: OffsetPaging!
    ) {
        files(filter: $filter, sorting: $sorting, paging: $paging) {
            nodes {
                ...FileFields
            }
            totalCount
        }
    }
    ${QUOTE_FRAGMENT}
`;

export const QUOTES_GET_QUOTE_QUERY = gql`
    query FilesGetFile($id: ID!) {
        file(id: $id) {
            ...FileFields
        }
    }
    ${QUOTE_FRAGMENT}
`;

export const QUOTES_CREATE_QUOTE_MUTATION = gql`
    mutation FilesCreateFile($input: CreateOneFileInput!) {
        createOneFile(input: $input) {
            ...FileFields
        }
    }
    ${QUOTE_FRAGMENT}
`;

export const QUOTES_UPDATE_QUOTE_MUTATION = gql`
    mutation FilesUpdateFile($input: UpdateOneFileInput!) {
        updateOneFile(input: $input) {
            ...FileFields
        }
    }
    ${QUOTE_FRAGMENT}
`;
