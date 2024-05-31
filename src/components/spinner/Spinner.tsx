import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';

const Spinner = () => {
    return <Spin indicator={<LoadingOutlined spin />} />;
};

export default Spinner;
