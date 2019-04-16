import React, { useContext, useState } from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import { Button, Card, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import renderIf from "render-if";
import { AuthContext } from "util/context";

const NewItem = ({ feedType, params }) => {
  const { token } = useContext(AuthContext);
  const [body, setBody] = useState("");

  const capFeedType =
    feedType.charAt(0).toUpperCase() + feedType.slice(1).toLowerCase();
  const CREATE_POST = gql`
    mutation Create${capFeedType}($body: String!${
    feedType === "comment" ? ", $postId: String!" : ""
  }) {
      create${capFeedType}(body: $body${
    feedType === "comment" ? ", postId: $postId" : ""
  }) {
        id
      }
    }
  `;

  return (
    <Mutation mutation={CREATE_POST} onCompleted={() => setBody("")}>
      {(submit, { data, loading, error }) => {
        return (
          <Card className="mb-4">
            <Card.Body>
              {renderIf(token)(
                <Form
                  onSubmit={(e) => {
                    e.preventDefault();
                    submit({ variables: { body, ...params } });
                  }}
                >
                  <Form.Group>
                    <Form.Control
                      as="textarea"
                      rows="3"
                      placeholder="What's on your mind?"
                      value={body}
                      onChange={(e) => setBody(e.target.value)}
                    />
                  </Form.Group>

                  <Button variant="primary" type="submit" disabled={loading}>
                    {loading ? "Submitting..." : "Submit"}
                  </Button>
                </Form>,
              )}
              {renderIf(!token)(
                <div className="text-muted h7">
                  <Link to="/login">Log in</Link> to submit a {feedType}.
                </div>,
              )}
            </Card.Body>
          </Card>
        );
      }}
    </Mutation>
  );
};

export default NewItem;