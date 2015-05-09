package weka.api;


import java.io.FileOutputStream;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;
import java.util.Vector;

import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;

import weka.classifiers.Classifier;
import weka.classifiers.bayes.BayesNet;
import weka.classifiers.bayes.NaiveBayes;
import weka.classifiers.evaluation.Evaluation;
import weka.classifiers.functions.MultilayerPerceptron;
import weka.classifiers.functions.SMO;
import weka.classifiers.functions.SMOreg;
import weka.classifiers.functions.supportVector.RegSMO;
import weka.classifiers.lazy.KStar;
import weka.classifiers.pmml.consumer.NeuralNetwork;
import weka.classifiers.rules.ZeroR;
import weka.classifiers.trees.J48;
import weka.core.*;
import weka.core.converters.ConverterUtils.DataSource;
import weka.core.pmml.jaxbbindings.SupportVectorMachine;

public class LoadSaveData {
	
	static String filename="C:\\Users\\this\\Documents\\Thesis\\Application\\dataMining\\report.xls" ;
	
	
	public class Results {
		public String name;
		public int _n;
		public double correct;
		public int maxError;
		public double RMSE;
		public double sigma;
		public double precision;
		public double recall;
		public Results() {};
	}
	
	
	static Map<String, Vector<Results>> map = new HashMap<String, Vector<Results>>();
	static Vector<Classifier> classifiers = new Vector<Classifier>();
	public static void main(String[] args) throws Exception {
		
		String file_1, file_2;
		
		
		
		
		NaiveBayes nb = new NaiveBayes();
		SMO smo = new SMO();
		ZeroR zeroR = new ZeroR();
		BayesNet bn = new BayesNet();
		MultilayerPerceptron nn = new MultilayerPerceptron();
		J48 j48 = new J48();
		KStar kstar = new KStar();
		
		classifiers.add(nb);
		classifiers.add(smo);
		classifiers.add(zeroR);
		classifiers.add(bn);
		classifiers.add(nn);
		classifiers.add(j48);
		classifiers.add(kstar);

		Results r;
		for(Classifier c: classifiers){
			String name = c.getClass().toString();
			name = name.substring(name.lastIndexOf('.') + 1);
			Vector<Results> results = new Vector<Results>();
			
			//Test 200k classes
			System.out.println("Test 200k classes :: " + name);
			file_1 = "C:\\Users\\this\\Documents\\Thesis\\Application\\dataMining\\export_200\\merge.arff";
			file_2 = "C:\\Users\\this\\Documents\\Thesis\\Application\\dataMining\\export_200\\dataset_3.arff";
			r = test(file_1, file_2, c);
			r.name = "200k";
			results.addElement(r);
			
			//Test 500k classes
			System.out.println("Test 500k classes :: " + name);
			file_1 = "C:\\Users\\this\\Documents\\Thesis\\Application\\dataMining\\export_500\\merge.arff";
			file_2 = "C:\\Users\\this\\Documents\\Thesis\\Application\\dataMining\\export_500\\dataset_3.arff";
			r = test(file_1, file_2,c);
			r.name = "500k";
			results.addElement(r);
			
			//Test  w/ Derivate
			System.out.println("Test 500k classes w/ derivate :: " + name);
			file_1 = "C:\\Users\\this\\Documents\\Thesis\\Application\\dataMining\\export_der\\merge.arff";
			file_2 = "C:\\Users\\this\\Documents\\Thesis\\Application\\dataMining\\export_der\\dataset_3.arff";
			r = test(file_1, file_2,c);
			r.name = "500k der";
			results.addElement(r);
			
			//Test  w/ Derivate winsize 8
			System.out.println("Test 500k derivate win8 :: " + name);
			file_1 = "C:\\Users\\this\\Documents\\Thesis\\Application\\dataMining\\export_der_win8\\merge.arff";
			file_2 = "C:\\Users\\this\\Documents\\Thesis\\Application\\dataMining\\export_der_win8\\dataset_3.arff";
			r = test(file_1, file_2,c);
			r.name = "500k der win8";
			results.addElement(r);
			
			//Test  w/ Derivate winsize 10
			System.out.println("Test 500k derivate win10 :: " + name);
			file_1 = "C:\\Users\\this\\Documents\\Thesis\\Application\\dataMining\\export_der_win10\\merge.arff";
			file_2 = "C:\\Users\\this\\Documents\\Thesis\\Application\\dataMining\\export_der_win10\\dataset_3.arff";
			r = test(file_1, file_2,c);
			r.name = "500k der win10";
			results.addElement(r);
			
			
			map.put(c.getClass().toString(), results);
		}
		writeFile();
		//SerializationHelper.write("test_model.model", tree);
		
	}
	
	public static Results test(String file_1, String file_2, Classifier tree) throws Exception{
		DataSource source = new DataSource(file_1);
		Instances dataset = source.getDataSet();
		//Set the index to the last column
		dataset.setClassIndex(dataset.numAttributes() - 1);
		
		//CREATE
		//weka.classifiers.
		//NeuralNetwork tree = new NeuralNetwork();
		//NaiveBayes tree = new NaiveBayes();
		//SMO tree = new SMO();
		//ZeroR tree = new ZeroR();
		//BayesNet tree = new BayesNet();
		//MultilayerPerceptron tree = new MultilayerPerceptron();
		//J48 tree = new J48();
		//KStar tree = new KStar();
		tree.buildClassifier(dataset);
		

		//READ 
		//NaiveBayes tree = (NaiveBayes) SerializationHelper.read("test_model.model");
		
		
		DataSource source2 = new DataSource(file_2);
		Instances dataset2 = source2.getDataSet();
		dataset2.setClassIndex(dataset2.numAttributes() - 1);
		//EVALUATION 
		Evaluation eval = new Evaluation(dataset);
		eval.crossValidateModel(tree, dataset2, 10, new Random());
		//eval.evaluateModel(tree, dataset2);
		//System.out.println(eval.toMatrixString());
		//System.out.println(eval.toSummaryString());
		
		//PREDICTION
		int num = 0;
		int totErr = 0;
		int maxErr = 0;
		for(int i = 0; i < dataset2.numInstances(); i++){
			double actualClass = dataset2.instance(i).classValue();
			String actual = dataset2.classAttribute().value((int) actualClass);
			
			Instance newInst = dataset2.instance(i);
			double predictClass = tree.classifyInstance(newInst);
			String predict = dataset2.classAttribute().value((int) predictClass);
			int indexError = (int)predictClass - (int) actualClass;
			indexError = Math.abs(indexError);
			if(indexError > maxErr){
				maxErr = indexError;
			}
			totErr += indexError;
			//System.out.println(actual + " :: " + predict + " :: Error " + indexError);
			if(actual.equals(predict)){ num++ ; }
		}
		
		//String _class = tree.getClass().toString();
		LoadSaveData x = new LoadSaveData();
		Results r = x.new Results();
		r.maxError = maxErr;
		r._n = dataset2.numInstances();
		r.correct = ((double)num/(double)dataset2.numInstances()*100);
		r.sigma = (double)totErr / (double)dataset2.numInstances();
		//r.name = _class; 
		r.RMSE = eval.rootMeanSquaredError();
		r.precision = eval.weightedPrecision();
		r.recall = eval.weightedRecall();
		eval.coverageOfTestCasesByPredictedRegions();
		//eval.fMeasure(0);
		return r;
		/*
		System.out.println("Max error: " + maxErr);
		System.out.println(num + "/" + dataset2.numInstances() + "=" + ((double)num/(double)dataset2.numInstances()*100) + "%");
		System.out.println((double)totErr / (double)dataset2.numInstances());*/
	}
	
	public static void writeFile(){
		
        HSSFWorkbook workbook = new HSSFWorkbook();
        HSSFSheet sheet = workbook.createSheet("FirstSheet");  

        Classifier _first = classifiers.firstElement();
        String _firstname = _first.getClass().toString();
    	Vector<Results> _firstrv = map.get(_firstname);
    	HSSFRow head = sheet.createRow((short)2);
    	HSSFRow headhead = sheet.createRow((short)1);
    	int j = 0;
    	for(Results r : _firstrv){
    		headhead.createCell(7*j + 2).setCellValue(r.name);
    		head.createCell(7*j + 2).setCellValue("Max Error");
    		head.createCell(7*j + 3).setCellValue("% Correct");
    		head.createCell(7*j + 4).setCellValue("Sigma");
    		head.createCell(7*j + 5).setCellValue("RMSE");
    		head.createCell(7*j + 6).setCellValue("Precision");
    		head.createCell(7*j + 7).setCellValue("Recall");
    		j++;
    	}
    	
    	
        int i = 0;
        for(Classifier c: classifiers){
        	String name = c.getClass().toString();
        	Vector<Results> rv = map.get(name);
        	HSSFRow row = sheet.createRow((short)3 + i++);
    		row.createCell(0).setCellValue(name.substring(name.lastIndexOf('.') + 1));
        	j = 0;
        	for(Results r : rv){
        		row.createCell(7*j + 2).setCellValue(r.maxError);
        		row.createCell(7*j + 3).setCellValue(r.correct);
        		row.createCell(7*j + 4).setCellValue(r.sigma);
        		row.createCell(7*j + 5).setCellValue(r.RMSE);
        		row.createCell(7*j + 6).setCellValue(r.precision);
        		row.createCell(7*j + 7).setCellValue(r.recall);
        		j++;
        	}
        }
        
  
        try {
        	FileOutputStream fileOut = new FileOutputStream(filename);
			workbook.write(fileOut);
			fileOut.close();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
        
        System.out.println("Your excel file has been generated!");
	}
}
