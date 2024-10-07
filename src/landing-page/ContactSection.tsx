import { Button, Col, Form, Input, Row, Typography } from "antd";

export const ContactSection = () => (
  <section id="contact" className="bg-gray-100 py-20">
    <div className="container mx-auto px-8 md:px-16">
      <Typography.Title
        level={2}
        className="text-3xl font-bold mb-8 text-center"
      >
        Contact Us
      </Typography.Title>
      <Row justify="center">
        <Col xs={24} md={12}>
          <Form layout="vertical">
            <Form.Item
              label="Your Name"
              name="name"
              rules={[{ required: true, message: "Please enter your name" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Your Email"
              name="email"
              rules={[
                {
                  required: true,
                  type: "email",
                  message: "Please enter a valid email",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Message"
              name="message"
              rules={[{ required: true, message: "Please enter your message" }]}
            >
              <Input.TextArea rows={4} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Send Message
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </div>
  </section>
);
