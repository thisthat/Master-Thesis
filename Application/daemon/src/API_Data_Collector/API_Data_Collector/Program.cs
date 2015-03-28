using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace API_Data_Collector
{

    class Program
    {
        static string script_name = "grab_network_data.py";
        static int wait_time = 1 * 60 * 1000; // 1 Min = 10*60 Sec = 10*60*1000 ms
        static string path = "";
        static void Main(string[] args)
        {
            

            path = System.Reflection.Assembly.GetExecutingAssembly().Location;
            path = path.Substring(0, path.LastIndexOf("\\"));

            var content = new StringBuilder(1024);
            GetPrivateProfileString("CONFIG", "time", "60", content, 1024, path + "\\config.ini");

            wait_time = Int32.Parse(content.ToString()) * 1000;
            
            Thread t = new Thread(collectData);
            t.Start();
        }

        //INI File
        [DllImport("KERNEL32.DLL", EntryPoint = "GetPrivateProfileStringW",
  SetLastError = true,
  CharSet = CharSet.Unicode, ExactSpelling = true,
  CallingConvention = CallingConvention.StdCall)]
        private static extern int GetPrivateProfileString(string lpAppName, string lpKeyName, string lpDefault, StringBuilder lpReturnString, int nSize, string lpFilename);
        
        static void collectData()
        {
            while (true)
            {
                CallPythonScript();
                var d = DateTime.Now;
                string data = d.Day + "/" + d.Month + "/" + d.Year + " " + d.Hour + ":" + d.Minute + ":" + d.Second;
                Console.WriteLine("[" + data + "] Data Collected Correctly");
                Thread.Sleep(wait_time);
            }
        }
        static void CallPythonScript()
        {
            Process p = new Process();
            // Redirect the output stream of the child process.
            p.StartInfo.UseShellExecute = false;
            p.StartInfo.RedirectStandardOutput = true;
            p.StartInfo.FileName = @"python.exe";
            p.StartInfo.Arguments = " " + path + "\\" + script_name;
            //Console.WriteLine(p.StartInfo.Arguments);
            p.StartInfo.CreateNoWindow = true;
            p.Start();
            //string output_d = p.StandardOutput.ReadToEnd();
            //Console.WriteLine(output_d);
            p.WaitForExit();
        }
    }
}
