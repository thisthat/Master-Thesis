package weka.api;


import java.util.Random;

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
	public static void main(String[] args) throws Exception {
		
		String file_1, file_2;
		
		
		//Test 200k classes
		System.out.println("_________________");
		System.out.println("Test 200k classes");
		file_1 = "C:\\Users\\this\\Documents\\Thesis\\Application\\dataMining\\export_200\\merge.arff";
		file_2 = "C:\\Users\\this\\Documents\\Thesis\\Application\\dataMining\\export_200\\dataset_3.arff";
		test(file_1, file_2);
		
		
		//Test 500k classes
		System.out.println("_________________");
		System.out.println("Test 500k classes");
		file_1 = "C:\\Users\\this\\Documents\\Thesis\\Application\\dataMining\\export_500\\merge.arff";
		file_2 = "C:\\Users\\this\\Documents\\Thesis\\Application\\dataMining\\export_500\\dataset_3.arff";
		test(file_1, file_2);
		
		
		//Test  w/ Derivate
		System.out.println("_________________");
		System.out.println("Test 500k classes w/ derivate");
		file_1 = "C:\\Users\\this\\Documents\\Thesis\\Application\\dataMining\\export_der\\merge.arff";
		file_2 = "C:\\Users\\this\\Documents\\Thesis\\Application\\dataMining\\export_der\\dataset_3.arff";
		test(file_1, file_2);
		
		//SerializationHelper.write("test_model.model", tree);
		
	}
	
	public static void test(String file_1, String file_2) throws Exception{
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
		KStar tree = new KStar();
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
		System.out.println("Max error: " + maxErr);
		System.out.println(num + "/" + dataset2.numInstances() + "=" + ((double)num/(double)dataset2.numInstances()*100) + "%");
		System.out.println((double)totErr / (double)dataset2.numInstances());
	}

}
