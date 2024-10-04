import { Col, Row, Typography } from 'antd';
import { motion } from 'framer-motion';

export const AboutSection = () => (
  <motion.section
    id="about"
    className="bg-white py-20"
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.5 }}
    transition={{ duration: 0.8 }}
    variants={{
      hidden: { opacity: 0, x: -50 },
      visible: { opacity: 1, x: 0 },
    }}
  >
    <div className="container mx-auto px-8 md:px-16">
      <Row align="middle" gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <motion.img
            src="/assets/img/about.webp"
            alt="About Us"
            className="w-full h-auto rounded-lg shadow-lg"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1 }}
          />
        </Col>
        <Col xs={24} md={12}>
          <Typography.Title level={2} className="text-3xl font-bold mb-4">
            Welcome to ProxyFidelity Services
          </Typography.Title>
          <Typography.Paragraph className="text-lg mb-4">
            ProxyFidelity Services is a leading provider of third-party risk management, project financial monitoring, building construction, facility management, project quality control, and project management services in Africa.
          </Typography.Paragraph>
          <Typography.Paragraph className="text-lg">
            We help businesses and individuals mitigate risk, save money, and achieve their goals remotely.
          </Typography.Paragraph>
        </Col>
      </Row>
    </div>
  </motion.section>
);
