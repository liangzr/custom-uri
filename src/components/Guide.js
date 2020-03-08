import React from 'react';
import { Typography } from 'antd';

const { Title, Paragraph, Text } = Typography;

export default () => (
  <Typography>
    <Title>欢迎使用</Title>
    <Paragraph>
      URI 生成工具可以帮您快速的生成复杂的 URI，或是<Text strong>编辑已有的</Text>复杂 URI。
    </Paragraph>
    <Paragraph>
      目前 URI 生成工具已经支持 URI、Query、JSON 的递归解析，基本满足日常所需。在任意可输入域内编辑的内容会即时更新到全局，同时也会在右侧更新二维码，扫码即用。
    </Paragraph>
    <Title level={2}>认识 URI</Title>
    <Paragraph>
      URI（Uniform Resource Identifier）即<Text strong>统一资源标识符</Text>，用于标识某一互联网资源名称的字符串，我们常见到的 URL 语法遵守了 URI 的规范，是它的子类。它通常由以下这五个部分组成
      <pre>
        URI = scheme:[//authority]path[?query][#fragment]
      </pre>
    </Paragraph>
    <Paragraph>
      其中<Text code>authority</Text>部分又分为三个子模块
      <pre>
        authority = [userinfo@]host[:port]
      </pre>
    </Paragraph>
    <Paragraph>
      <img style={{ width: '100%' }} src="https://gw.alipayobjects.com/zos/antfincdn/W4GKw52%24Uh/60446036-88ed-4c71-8cdb-2ab52acfb2df.png" alt="" />
    </Paragraph>
  </Typography>
);
