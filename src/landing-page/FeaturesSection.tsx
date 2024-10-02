import { Row, Col, Typography } from 'antd';

export const FeaturesSection = () => (
  <section id="features" className="bg-gray-100 py-20">
    <div className="container mx-auto px-8 md:px-16">
      <Typography.Title level={2} className="text-3xl font-bold mb-8 text-center">
        Features
      </Typography.Title>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Typography.Paragraph>
            Real-time tracking of project finances, dedicated client relationship managers, and online access to project reports.
          </Typography.Paragraph>
        </Col>
        <Col xs={24} md={12}>
          <img src="/assets/img/features.png" alt="Features" className="w-full h-auto rounded-lg shadow-md" />
        </Col>
      </Row>
    </div>
  </section>
);

