import { faHeartbeat } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
export default function MedicalRecordHome() {
  return (
    <div>
      <nav className="bg-white dark:bg-gray-900 fixed w-full z-20 top-0 left-0 border-b border-gray-200 dark:border-gray-600">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <a href="#" className="flex items-center">
            <div className="h-8 mr-1">
              <div className="">
                <div className="font-normal text-gray-500">
                  <FontAwesomeIcon
                    icon={faHeartbeat}
                    size="2x"
                    className="mr-2 text-blue-500"
                  />
                </div>
              </div>
            </div>
            <span className="self-center  text-2xl font-bold whitespace-nowrap dark:text-white">
              <span className="text-transparent bg-clip-text bg-gradient-to-bl  from-purple-600 to-blue-500 hover:bg-gradient-to-bl">
                Medchain
              </span>
            </span>
          </a>
          <div className="flex md:order-2">
            {/* <a
              type="button"
              href="/Hospital/LoginPage"
              target="_blank"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center mr-3 md:mr-0 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Hospital
            </a> */}
            <button
              data-collapse-toggle="navbar-sticky"
              type="button"
              className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              aria-controls="navbar-sticky"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="w-6 h-6"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
          <div
            className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
            id="navbar-sticky"
          >
            <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
              <li>
                <a
                  href="/"
                  className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                  aria-current="page"
                >
                  Trang chủ
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="block py-2 pl-3 pr-4 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500"
                >
                  Hướng dẫn
                </a>
              </li>
              {/* <li>
                <a
                  href="#"
                  className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                >
                  Đặt lịch khám
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                >
                  Bệnh viện
                </a>
              </li> */}
            </ul>
          </div>
        </div>
      </nav>
      <div className="sm:container mt-24  sm:mx-auto">
        <ol className="relative border-l border-gray-200 dark:border-gray-700">
          <li className="mb-10 ml-6">
            <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
              1
            </span>
            <h3 className="flex items-center uppercase mb-1 text-lg font-bold text-gray-900 dark:text-white">
              Cài đặt ví metamask
            </h3>

            <div className="font-normal">
              Bệnh nhân cài đặt ví Metamask{" "}
              <a
                href="https://metamask.io/download/"
                className="font-semibold text-blue-600 dark:text-blue-500 hover:underline"
              >
                tại đây
              </a>{" "}
              và chọn mạng{" "}
              <span className="font-semibold text-blue-600 dark:text-blue-500 ">
                Sepolia
              </span>
              .
            </div>

            <img
              className="mx-auto"
              src="https://i.ibb.co/THY3WGR/chonmang.png"
              alt="chonmang"
              border={0}
            />
          </li>
          <li className="mb-10 ml-6">
            <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
              2
            </span>
            <h3 className="mb-1 text-lg uppercase font-bold text-gray-900 dark:text-white">
              Đăng nhập với ví Metamask
            </h3>

            <p className="text-base font-normal  ">
              Bệnh nhân truy cập{" "}
              <a
                href="/Patient/LoginPage"
                className="font-semibold text-blue-600 dark:text-blue-500 hover:underline"
              >
                tại đây
              </a>{" "}
              để đăng nhập.
            </p>
            <div>
              <div className="relative mx-auto border-gray-800 dark:border-gray-800 bg-gray-800 border-[8px] rounded-t-xl h-[172px] max-w-[301px] md:h-[294px] md:max-w-[512px]">
                <div className="rounded-lg  overflow-hidden h-[156px] md:h-[278px] bg-white dark:bg-gray-800">
                  <img
                    src="https://i.ibb.co/MSpDkZX/benhnhan-dangnhap.png"
                    alt="benhnhan-dangnhap"
                    border={0}
                  />
                </div>
              </div>
              <div className="relative mx-auto bg-gray-900 dark:bg-gray-700 rounded-b-xl rounded-t-sm h-[17px] max-w-[351px] md:h-[21px] md:max-w-[597px]">
                <div className="absolute left-1/2 top-0 -translate-x-1/2 rounded-b-xl w-[56px] h-[5px] md:w-[96px] md:h-[8px] bg-gray-800" />
              </div>
            </div>
            <p className="text-base font-normal mt-2 mb-2 ">
              Sau khi đăng nhập, bệnh nhân vào phần{" "}
              <span className="font-semibold text-blue-600 dark:text-blue-500 ">
                cài đặt
              </span>{" "}
              để cập nhật hồ sơ.
            </p>
            <div>
              <div className="relative mx-auto border-gray-800 dark:border-gray-800 bg-gray-800 border-[8px] rounded-t-xl h-[200px] max-w-[301px] md:h-[294px] md:max-w-[512px]">
                <div className="rounded-lg overflow-hidden h-[156px] md:h-[278px] bg-white dark:bg-gray-800">
                  <img
                    src="https://i.ibb.co/VBjpMBQ/capnhathosobenhnhan.png"
                    alt="capnhathosobenhnhan"
                    border={0}
                  />
                </div>
              </div>
              <div className="relative mx-auto bg-gray-900 dark:bg-gray-700 rounded-b-xl rounded-t-sm h-[17px] max-w-[351px] md:h-[21px] md:max-w-[597px]">
                <div className="absolute left-1/2 top-0 -translate-x-1/2 rounded-b-xl w-[56px] h-[5px] md:w-[96px] md:h-[8px] bg-gray-800" />
              </div>
            </div>
          </li>
          <li className="ml-6">
            <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
              3
            </span>
            <h3 className="mb-1 uppercase text-lg font-bold text-gray-900 dark:text-white">
              ĐẶT LỊCH KHÁM BỆNH
            </h3>
            <p className="text-base font-normal mt-2 mb-2 ">
              Bệnh nhân vào mục{" "}
              <span className="font-semibold text-blue-600 dark:text-blue-500 ">
                đặt lịch khám
              </span>{" "}
              chọn bác sĩ và đặt khám.
            </p>
            <p className="text-base font-normal mt-2 mb-2 ">
              Bệnh nhân chờ nhân viên gọi điện{" "}
              <span className="font-semibold text-blue-600 dark:text-blue-500 ">
                xác nhận
              </span>
              .
            </p>
            <p className="text-base font-normal mt-2 mb-2 ">
              Sau khi xác nhận thành công, bệnh nhân sẽ nhận được ngay{" "}
              <span className="font-semibold text-blue-600 dark:text-blue-500 ">
                phiếu khám bệnh điện tử
              </span>{" "}
              trên website (và qua email).
            </p>
            <div>
              <div className="relative mx-auto border-gray-800 dark:border-gray-800 bg-gray-800 border-[8px] rounded-t-xl h-[200px] max-w-[301px] md:h-[294px] md:max-w-[512px]">
                <div className="rounded-lg overflow-hidden h-[156px] md:h-[278px] bg-white dark:bg-gray-800">
                  <img
                    src="https://i.ibb.co/zJtpbRb/phieukham.jpg"
                    alt="phieukham"
                    border={0}
                  />
                </div>
              </div>
              <div className="relative mx-auto bg-gray-900 dark:bg-gray-700 rounded-b-xl rounded-t-sm h-[17px] max-w-[351px] md:h-[21px] md:max-w-[597px]">
                <div className="absolute left-1/2 top-0 -translate-x-1/2 rounded-b-xl w-[56px] h-[5px] md:w-[96px] md:h-[8px] bg-gray-800" />
              </div>
            </div>
          </li>
          <li className="ml-6">
            <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
              4
            </span>
            <h3 className="mb-1 uppercase text-lg font-bold text-gray-900 dark:text-white">
              Khám
            </h3>
            <p className="text-base font-normal mt-2 mb-2 ">
              Đến ngày khám, người bệnh vui lòng đến trực tiếp phòng khám hoặc
              quầy tiếp nhận theo như hướng dẫn trên phiếu khám.
            </p>
          </li>
          <li className="ml-6">
            <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
              5
            </span>
            <h3 className="mb-1 uppercase text-lg font-bold text-gray-900 dark:text-white">
              Xem bệnh án
            </h3>
            <p className="text-base font-normal mt-2 mb-2 ">
              Sau khi được bác sĩ tạo bệnh án và bệnh viện phê duyệt lưu vào{" "}
              <span className="font-semibold text-blue-600 dark:text-blue-500 ">
                Blockchain
              </span>
              , bệnh nhân có thể xem bệnh án và các số liệu thống kê của mình.
            </p>
            <div>
              <div className="relative mx-auto border-gray-800 dark:border-gray-800 bg-gray-800 border-[8px] rounded-t-xl h-[200px] max-w-[301px] md:h-[294px] md:max-w-[512px]">
                <div className="rounded-lg overflow-hidden h-[156px] md:h-[278px] bg-white dark:bg-gray-800">
                  <img
                    src="https://i.ibb.co/xz6D5Dn/bennhanxembenhan.jpg"
                    alt="bennhanxembenhan"
                    border={0}
                  />
                </div>
              </div>
              <div className="relative mx-auto bg-gray-900 dark:bg-gray-700 rounded-b-xl rounded-t-sm h-[17px] max-w-[351px] md:h-[21px] md:max-w-[597px]">
                <div className="absolute left-1/2 top-0 -translate-x-1/2 rounded-b-xl w-[56px] h-[5px] md:w-[96px] md:h-[8px] bg-gray-800" />
              </div>
            </div>
          </li>
        </ol>
      </div>

      <footer className="bg-white  rounded-lg shadow dark:bg-gray-900 m-4">
        <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
          <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
          <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">
            © 2023 Medchain. Đã đăng ký Bản quyền.
          </span>
        </div>
      </footer>
    </div>
  );
}
