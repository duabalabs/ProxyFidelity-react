import React from 'react';
import { Link } from 'react-router-dom';

import { AppstoreOutlined, HomeOutlined, InfoCircleOutlined, MailOutlined,TeamOutlined } from '@ant-design/icons';
import { Menu } from 'antd';

export const Header = () => (
  <header className="fixed w-full top-0 z-50 bg-white shadow-md">
    <div className="container mx-auto flex justify-between items-center py-4 px-8">
      <Link to="/" className="font-bold text-2xl text-blue-600">
        ProxyFidelity
      </Link>
      <Menu mode="horizontal" className="hidden md:flex space-x-8">
        <Menu.Item key="home" icon={<HomeOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}>
          <Link to="/#hero">Home</Link>
        </Menu.Item>
        <Menu.Item key="about" icon={<InfoCircleOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}>
          <Link to="/#about">About</Link>
        </Menu.Item>
        <Menu.Item key="services" icon={<AppstoreOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}>
          <Link to="/#services">Services</Link>
        </Menu.Item>
        <Menu.Item key="team" icon={<TeamOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}>
          <Link to="/#team">Team</Link>
        </Menu.Item>
        <Menu.Item key="contact" icon={<MailOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}>
          <Link to="/#contact">Get In Touch</Link>
        </Menu.Item>
      </Menu>
    </div>
  </header>
);