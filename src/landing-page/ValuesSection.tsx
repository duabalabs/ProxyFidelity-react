import { Card, Col, Row, Typography } from 'antd';
import { motion } from 'framer-motion';

const { Title, Paragraph } = Typography;

const values = [
  {
    title: 'Transparency',
    description:
      'We are committed to providing our clients with complete transparency about our services and how we manage their investments.',
    imgSrc: '/assets/img/values/transparency.webp',
    delay: 0.2,
  },
  {
    title: 'Accountability',
    description:
      'We hold ourselves accountable for the quality of our work and the results we deliver to our clients.                             ',
    imgSrc: '/assets/img/values/accountability.webp',
    delay: 0.4,
  },
  {
    title: 'Excellence',
    description:
      'We strive to provide our clients with the highest level of service possible, ensuring excellence in every project.                   ',
    imgSrc: '/assets/img/values/excellence.webp',
    delay: 0.6,
  },
];

export const ValuesSection = () => {
  return (
    <motion.section
      id="values"
      className="values py-16 bg-gray-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div className="container mx-auto px-16 text-center">
        <motion.header
          className="section-header mb-12"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <Title level={1} className="text-blue-800 font-bold mb-4">
            Our Values
          </Title>
        </motion.header>

        <Row gutter={[24, 24]} justify="center">
          {values.map((value, index) => (
            <Col key={index} xs={24} md={12} lg={8}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: value.delay }}
              >
                <Card
                  hoverable
                  bordered={false}
                  className="value-card"
                  style={{
                    borderRadius: '15px',
                    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
                    overflow: 'hidden',
                    backgroundColor: '#ffffff',
                    transition: 'transform 0.3s',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                  bodyStyle={{ padding: '24px', display: 'flex', flexDirection: 'column' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                    <motion.img
                      src={value.imgSrc}
                      alt={value.title}
                      className="object-cover"
                      style={{
                        width: '150px',
                        height: '150px',
                        borderRadius: '10%',
                        transition: 'transform 0.3s',
                      }}
                      whileHover={{ scale: 1.05 }}
                    />
                  </div>
                  <div style={{ textAlign: 'center', flexGrow: 1 }}>
                    <Title level={3} className="text-blue-800 mb-4">
                      {value.title}
                    </Title>
                    <Paragraph className="text-gray-600">
                      {value.description}
                    </Paragraph>
                  </div>
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>
      </div>
    </motion.section>
  );
};

export default ValuesSection;