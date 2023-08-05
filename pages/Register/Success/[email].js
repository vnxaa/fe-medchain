import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
const Success = () => {
  const router = useRouter();
  const { email } = router.query; // Access the 'email' property from router.query

  useEffect(() => {
    // Add any necessary logic
  }, [router]);

  return (
    <div>
      <div className="sm:container center sm:mx-auto">
        <div className="w-full p-4 mt-10 text-center bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700">
          <h5 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
            Gửi yêu cầu thành công
          </h5>
          <p className="mb-5text-base text-gray-500 sm:text-lg dark:text-gray-400">
            Bạn sẽ nhận được phản hồi qua email {email} khi tài khoản được phê
            duyệt thành công.
          </p>
          <div className="items-center justify-center space-y-4 sm:flex sm:space-y-0 sm:space-x-4">
            <div className="flex mt-3 flex-col space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
              <Link href="/">
                <a className="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900">
                  Trang Chủ
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Success;
