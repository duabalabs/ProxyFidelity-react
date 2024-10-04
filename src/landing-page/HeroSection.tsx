import { Button, Col,Row, Typography } from 'antd';
import { motion } from 'framer-motion';

export const HeroSection = () => (
  <motion.section
    id="hero"
    className="hero relative h-screen flex items-center text-white"
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 1 }}
  >
    <div className="container mx-auto px-8 md:px-16">
      <Row justify="center" align="middle" gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Typography.Title level={1} className="text-4xl md:text-6xl font-bold mb-4">
            Welcome to ProxyFidelity Services
          </Typography.Title>
          <Typography.Paragraph className="text-lg md:text-xl">
            Your one-stop online project management platform for Expatriates and Africans in the diaspora seeking to work on projects or provide services in Ghana remotely.
          </Typography.Paragraph>

        </Col>
        <Col xs={24} md={12}>
          <motion.img
            src="/assets/img/hero-img.webp"
            alt="Hero Image"
            className="w-full h-auto"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5 }}
          />
        </Col>
      </Row>
    </div>
  </motion.section>
);
