import React, { useState } from 'react';

import { Card, Col, Row, Typography } from 'antd';
import { motion } from 'framer-motion';

import "./styles.css"

const { Title, Paragraph } = Typography;

const services = [
  {
    title: 'Due Diligence/Third-Party Risk Management',
    description: `We conduct comprehensive due diligence on behalf of our clients to identify and mitigate risks associated with real estate investment, business ventures, and other investments. Our team of experienced professionals has the knowledge and expertise to identify and assess risks, and we work closely with our clients to develop risk mitigation strategies.`,
    color: '#2db6fa',
    bgColor: '#dbf3fe',
    image: '/assets/img/services/due-diligence.webp',
    delay: 0.2,
  },
  {
    title: 'Project Financial Monitoring',
    description: `We track and monitor the financial aspects of our clients' projects to ensure that they are on track and within budget. We provide detailed financial reports, regular updates, and timely alerts to help our clients make informed decisions about their projects.`,
    color: '#f68c09',
    bgColor: '#fde3c4',
    image: '/assets/img/services/financial-monitoring.webp',
    delay: 0.3,
  },
  {
    title: 'Facility Management',
    description: `We provide comprehensive facility management services to businesses and organizations. Our services include regular inspections and maintenance, monitoring of key systems and equipment, and response to any emergency situations. We also provide support services, such as procurement and management of supplies and equipment, as well as management of any necessary upgrades or renovations.`,
    color: '#08da4e',
    bgColor: '#cffddf',
    image: '/assets/img/services/facility-management.webp',
    delay: 0.4,
  },
  {
    title: 'Project Quality Control',
    description: `We implement rigorous quality control procedures to ensure that our clients' projects are completed to the highest standards. We conduct regular inspections of the construction site, monitor key systems and materials, and work closely with the construction team to identify and correct any potential issues.`,
    color: '#e9222c',
    bgColor: '#fef7f8',
    image: '/assets/img/services/quality-control.webp',
    delay: 0.5,
  },
  {
    title: 'Project Management Services',
    description: `We manage our clients' projects from start to finish, ensuring that they are completed on time and within budget. We coordinate all aspects of the project, including procurement, site preparation, and construction. We also work closely with our clients to ensure that their needs and goals are met.`,
    color: '#b50edf',
    bgColor: '#f8e4fd',
    image: '/assets/img/services/project-management.webp',
    delay: 0.6,
  },
  {
    title: 'E-Procurement',
    description: `As an online project management company, we can help you streamline your procurement process with e-procurement. We can provide you with a platform to manage your procurement needs, and we can help you find the best suppliers for your projects.`,
    color: '#f51f9c',
    bgColor: '#feecef',
    image: '/assets/img/services/e-procurement.webp',
    delay: 0.7,
  },
];

export const ServicesSection = () => {
  const [hoveredCard, setHoveredCard] = useState(null);

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
          {services.map((service, index) => (
            <Col key={index} xs={24} sm={12} md={12} lg={8}>
              <Card
                hoverable
                className="service-card"
                style={{
                  borderRadius: '5px',
                  boxShadow: '0px 0px 30px rgba(1, 41, 112, 0.08)',
                  borderBottom: `3px solid ${service.color}`,
                  height: '100%',
                  textAlign: 'center',
                  padding: '20px',
                  backgroundColor: hoveredCard === index ? service.bgColor : '#ffffff', // Change background color on hover
                  transition: 'background-color 0.3s ease, transform 0.3s ease',
                  transform: hoveredCard === index ? 'translateY(-10px)' : 'translateY(0)',
                }}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <motion.img
                  src={service.image}
                  alt={service.title}
                  className="service-image"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 1.5, delay: service.delay }}
                  style={{
                    width: '150px',
                    height: '150px',
                    objectFit: 'cover',
                    borderRadius: '50%',
                    margin: '0 auto 20px',
                    display: 'block',
                  }}
                />
                <Title level={3} style={{ fontSize: '1.5rem', color: '#444', fontWeight: 700 }}>
                  {service.title}
                </Title>
                <Paragraph style={{ fontSize: '1rem', color: '#666' }}>{service.description}</Paragraph>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
      </motion.section>
  );
};

export default ServicesSection;